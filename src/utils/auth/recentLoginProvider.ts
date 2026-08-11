import type { SocialProvider } from "@/types/auth";

const RECENT_LOGIN_PROVIDER_KEY = "finders:recentLoginProvider";
const PENDING_SIGNUP_PROVIDER_KEY = "finders:pendingSignupProvider";

// 로그아웃과 무관하게 남아야 해서 useAuthStore(persist)와 분리된 별도 키로 관리
export function setRecentLoginProvider(provider: SocialProvider) {
  try {
    localStorage.setItem(RECENT_LOGIN_PROVIDER_KEY, provider);
  } catch (e) {
    console.error("최근 로그인 정보 저장에 실패했습니다.", e);
  }
}

export function getRecentLoginProvider(): SocialProvider | null {
  try {
    const value = localStorage.getItem(RECENT_LOGIN_PROVIDER_KEY);
    return value === "KAKAO" || value === "APPLE" ? value : null;
  } catch {
    return null;
  }
}

// 신규 회원은 가입이 끝나야 "최근 로그인"으로 기록되므로, 그때까지 provider를 임시 보관한다.
// (온보딩 시점엔 provider를 알 수 없고, 카카오 웹은 리다이렉트를 타므로 localStorage 사용)
export function setPendingSignupProvider(provider: SocialProvider) {
  try {
    localStorage.setItem(PENDING_SIGNUP_PROVIDER_KEY, provider);
  } catch (e) {
    console.error("가입 중 소셜 정보 저장에 실패했습니다.", e);
  }
}

// 가입 완료 시점에 임시 보관한 provider를 "최근 로그인"으로 확정한다.
export function commitPendingSignupProvider() {
  try {
    const value = localStorage.getItem(PENDING_SIGNUP_PROVIDER_KEY);
    localStorage.removeItem(PENDING_SIGNUP_PROVIDER_KEY);
    if (value === "KAKAO" || value === "APPLE") {
      setRecentLoginProvider(value);
    }
  } catch (e) {
    console.error("최근 로그인 정보 저장에 실패했습니다.", e);
  }
}
