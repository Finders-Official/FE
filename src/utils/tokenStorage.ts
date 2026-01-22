export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  setTokens(tokens: AuthTokens) {
    if (tokens.accessToken)
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    else localStorage.removeItem(ACCESS_KEY);

    if (tokens.refreshToken)
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    else localStorage.removeItem(REFRESH_KEY);
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
