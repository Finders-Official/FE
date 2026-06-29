import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { isNativeApp } from "./auth/envUtils";

export type AuthTokens = {
  accessToken: string | null;
  signupToken: string | null;
};

const ACCESS_KEY = "accessToken";
const SIGNUP_KEY = "signupToken";

export const tokenStorage = {
  // Access Token 가져오기
  async getAccessToken(): Promise<string | null> {
    if (isNativeApp()) {
      try {
        const { value } = await SecureStoragePlugin.get({ key: ACCESS_KEY });
        return value;
      } catch {
        return null;
      }
    }
    return localStorage.getItem(ACCESS_KEY);
  },

  // Signup Token 가져오기
  async getSignupToken(): Promise<string | null> {
    if (isNativeApp()) {
      try {
        const { value } = await SecureStoragePlugin.get({ key: SIGNUP_KEY });
        return value;
      } catch {
        return null;
      }
    }
    return localStorage.getItem(SIGNUP_KEY);
  },

  // 토큰 저장하기 (로그인 성공 시)
  async setTokens(tokens: AuthTokens): Promise<void> {
    if (isNativeApp()) {
      if (tokens.accessToken)
        await SecureStoragePlugin.set({
          key: ACCESS_KEY,
          value: tokens.accessToken,
        });
      else await SecureStoragePlugin.remove({ key: ACCESS_KEY });

      if (tokens.signupToken)
        await SecureStoragePlugin.set({
          key: SIGNUP_KEY,
          value: tokens.signupToken,
        });
      else await SecureStoragePlugin.remove({ key: SIGNUP_KEY });

      // refreshToken 저장 로직 삭제!
    } else {
      if (tokens.accessToken)
        localStorage.setItem(ACCESS_KEY, tokens.accessToken);
      else localStorage.removeItem(ACCESS_KEY);

      if (tokens.signupToken)
        localStorage.setItem(SIGNUP_KEY, tokens.signupToken);
      else localStorage.removeItem(SIGNUP_KEY);
    }
  },

  // 단일 토큰 세팅
  async setSignupToken(token: string | null): Promise<void> {
    if (isNativeApp()) {
      if (token)
        await SecureStoragePlugin.set({ key: SIGNUP_KEY, value: token });
      else await SecureStoragePlugin.remove({ key: SIGNUP_KEY });
    } else {
      if (token) localStorage.setItem(SIGNUP_KEY, token);
      else localStorage.removeItem(SIGNUP_KEY);
    }
  },

  // 토큰 초기화 (로그아웃 시)
  async clear(): Promise<void> {
    if (isNativeApp()) {
      try {
        await SecureStoragePlugin.remove({ key: ACCESS_KEY });
      } catch {
        // ESLint 통과를 위한 주석 (에러 무시)
      }
      try {
        await SecureStoragePlugin.remove({ key: SIGNUP_KEY });
      } catch {
        // ESLint 통과를 위한 주석 (에러 무시)
      }
    } else {
      localStorage.removeItem(ACCESS_KEY);
      localStorage.removeItem(SIGNUP_KEY);
    }
  },
};
