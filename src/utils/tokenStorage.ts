import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";
import { isNativeApp } from "./auth/envUtils";

export type AuthTokens = {
  accessToken: string | null;
  signupToken: string | null;
};

const ACCESS_KEY = "accessToken";
const SIGNUP_KEY = "signupToken";

// SecureStorage remove 시 키가 없어도 에러 무시
const safeRemove = async (key: string) => {
  try {
    await SecureStoragePlugin.remove({ key });
  } catch {
    // 키가 없어도 무시
  }
};

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

  // 토큰 저장
  async setTokens(tokens: AuthTokens): Promise<void> {
    if (isNativeApp()) {
      if (tokens.accessToken) {
        await SecureStoragePlugin.set({
          key: ACCESS_KEY,
          value: tokens.accessToken,
        });
      } else {
        await safeRemove(ACCESS_KEY);
      }

      if (tokens.signupToken) {
        await SecureStoragePlugin.set({
          key: SIGNUP_KEY,
          value: tokens.signupToken,
        });
      } else {
        await safeRemove(SIGNUP_KEY);
      }

      return;
    }

    // Web
    if (tokens.accessToken) {
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    } else {
      localStorage.removeItem(ACCESS_KEY);
    }

    if (tokens.signupToken) {
      localStorage.setItem(SIGNUP_KEY, tokens.signupToken);
    } else {
      localStorage.removeItem(SIGNUP_KEY);
    }
  },

  // SignupToken만 저장
  async setSignupToken(token: string | null): Promise<void> {
    if (isNativeApp()) {
      if (token) {
        await SecureStoragePlugin.set({
          key: SIGNUP_KEY,
          value: token,
        });
      } else {
        await safeRemove(SIGNUP_KEY);
      }

      return;
    }

    if (token) {
      localStorage.setItem(SIGNUP_KEY, token);
    } else {
      localStorage.removeItem(SIGNUP_KEY);
    }
  },

  // 로그아웃
  async clear(): Promise<void> {
    if (isNativeApp()) {
      await safeRemove(ACCESS_KEY);
      await safeRemove(SIGNUP_KEY);
      return;
    }

    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(SIGNUP_KEY);
  },
};
