import { tokenStorage } from "@/utils/tokenStorage";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};

// 재시도 플래그를 config에 안전하게 심기 위한 타입 확장
type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// refresh 중복 호출 방지 + 대기열
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, newAccessToken: string | null) {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else if (newAccessToken) p.resolve(newAccessToken);
    else p.reject(new Error("No new access token"));
  });
  pendingQueue = [];
}

function shouldSkipAuth(config: AxiosRequestConfig) {
  const url = config.url ?? "";
  return url.startsWith("/auth/reissue") || url.startsWith("/auth/refresh");
}

type AttachedAuth = "access" | "signup" | "none";
type AuthMetaConfig = InternalAxiosRequestConfig & {
  _authAttached?: AttachedAuth;
};

async function requestRefreshToken(baseURL: string) {
  // refresh는 별도 axios로 호출(인터셉터 영향 X)
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const res = await axios.post<RefreshResponse>(
    `${baseURL}/auth/reissue`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" }, timeout: 15000 },
  );

  return res.data;
}

export function setupInterceptors(instance: AxiosInstance) {
  // Request: accessToken 우선, 없으면 signupToken 첨부
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const cfg = config as AuthMetaConfig;

      if (shouldSkipAuth(cfg)) {
        cfg._authAttached = "none";
        return cfg;
      }

      const accessToken = tokenStorage.getAccessToken();
      const signupToken = tokenStorage.getSignupToken();

      if (accessToken) {
        cfg.headers = cfg.headers ?? {};
        cfg.headers.Authorization = `Bearer ${accessToken}`;
        cfg._authAttached = "access";
      } else if (signupToken) {
        cfg.headers = cfg.headers ?? {};
        cfg.headers.Authorization = `Bearer ${signupToken}`;
        cfg._authAttached = "signup";
      } else {
        cfg._authAttached = "none";
      }

      return cfg;
    },
    (error) => Promise.reject(error),
  );

  // Response: 401 -> (access token 붙였던 요청만) refresh -> 원요청 재시도
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalConfig = error.config as
        | (RetryableConfig & AuthMetaConfig)
        | undefined;

      if (!originalConfig) return Promise.reject(error);

      // 401 아닌 경우 그냥 패스
      if (status !== 401) return Promise.reject(error);

      // refresh/reissue 요청이 401이면 더 이상 재시도하지 말고 토큰 정리
      if (shouldSkipAuth(originalConfig)) {
        tokenStorage.clear();
        return Promise.reject(error);
      }

      // signupToken으로 붙였던 요청은 refresh 대상이 아님
      // (온보딩 토큰 만료/무효면 서버가 401 줄 수 있음 -> 그대로 실패 처리 or signupToken만 제거)
      if (originalConfig._authAttached === "signup") {
        tokenStorage.setSignupToken(null); // 토큰스토리지에 이 메서드 없으면 clear에서 제거만 하거나 직접 remove
        return Promise.reject(error);
      }

      // accessToken을 붙였던 요청만 refresh 시도
      // 무한 루프 방지
      if (originalConfig._retry) {
        tokenStorage.clear();
        return Promise.reject(error);
      }
      originalConfig._retry = true;

      const baseURL = instance.defaults.baseURL;
      if (!baseURL) {
        return Promise.reject(new Error("axiosInstance baseURL is not set"));
      }

      // 이미 refresh 중이면 큐에 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken) => {
              originalConfig.headers = originalConfig.headers ?? {};
              originalConfig.headers.Authorization = `Bearer ${newToken}`;
              resolve(instance(originalConfig));
            },
            reject,
          });
        });
      }

      // refresh 시작
      isRefreshing = true;

      try {
        const data = await requestRefreshToken(baseURL);

        // 토큰 저장 (signupToken은 그대로 유지)
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? tokenStorage.getRefreshToken(),
          signupToken: tokenStorage.getSignupToken(),
        });

        // 대기 중인 요청들 처리
        processQueue(null, data.accessToken);

        // 원요청 재시도
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;
        originalConfig._authAttached = "access";

        return instance(originalConfig);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        tokenStorage.clear();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
