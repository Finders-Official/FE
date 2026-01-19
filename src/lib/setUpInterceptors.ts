import { tokenStorage } from "@/utils/tokenStorage";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

// 서버 스펙에 맞게 조정 가능
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
  // refresh 호출 자체는 Authorization 붙이면 꼬일 수 있어서 제외
  const url = config.url ?? "";
  return url.includes("/auth/refresh");
}

async function requestRefreshToken(baseURL: string) {
  // refresh는 별도 axios로 호출(인터셉터 영향 X)
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  // ✅ 너희 백엔드 스펙에 맞게 path/body만 바꾸면 됨
  // 예) POST /auth/refresh { refreshToken }
  const res = await axios.post<RefreshResponse>(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    { headers: { "Content-Type": "application/json" }, timeout: 15000 },
  );

  return res.data;
}

export function setupInterceptors(instance: AxiosInstance) {
  // Request: accessToken 자동 첨부
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (!shouldSkipAuth(config)) {
        const accessToken = tokenStorage.getAccessToken();
        if (accessToken) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response: 401 -> refresh -> 원요청 재시도
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalConfig = error.config as RetryableConfig | undefined;

      if (!originalConfig) return Promise.reject(error);

      // 401 아닌 경우 그냥 패스
      if (status !== 401) return Promise.reject(error);

      // refresh 요청이 401이면 더 이상 재시도하지 말고 로그아웃 처리
      if (shouldSkipAuth(originalConfig)) {
        tokenStorage.clear();
        return Promise.reject(error);
      }

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

        // 토큰 저장
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? tokenStorage.getRefreshToken(),
        });

        // 대기 중인 요청들 처리
        processQueue(null, data.accessToken);

        // 원요청 재시도
        originalConfig.headers = originalConfig.headers ?? {};
        originalConfig.headers.Authorization = `Bearer ${data.accessToken}`;

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
