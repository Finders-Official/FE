export type AuthTokens = {
  accessToken: string | null;
  signupToken: string | null;
};

const ACCESS_KEY = "accessToken";
const SIGNUP_KEY = "signupToken";

// refreshToken은 서버가 httpOnly 쿠키로 관리하므로 클라이언트에 저장 X
export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_KEY);
  },

  getSignupToken(): string | null {
    return localStorage.getItem(SIGNUP_KEY);
  },

  setTokens(tokens: AuthTokens) {
    if (tokens.accessToken)
      localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    else localStorage.removeItem(ACCESS_KEY);

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
    localStorage.removeItem(SIGNUP_KEY);
  },
};
