export type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
  signupToken: string | null;
};

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";
const SIGNUP_KEY = "signupToken";

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_KEY);
  },

  getSignupToken(): string | null {
    return localStorage.getItem(SIGNUP_KEY);
  },

  setTokens(tokens: AuthTokens) {
    if (tokens.accessToken)
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    else localStorage.removeItem(ACCESS_KEY);

    if (tokens.refreshToken)
      localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    else localStorage.removeItem(REFRESH_KEY);

    if (tokens.signupToken)
      localStorage.setItem(SIGNUP_KEY, tokens.signupToken);
    else localStorage.removeItem(SIGNUP_KEY);
  },

  setSignupToken(token: string | null) {
    if (token) localStorage.setItem(SIGNUP_KEY, token);
    else localStorage.removeItem(SIGNUP_KEY);
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(SIGNUP_KEY);
  },
};
