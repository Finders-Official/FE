import type { SocialProvider } from "@/types/auth";

const RECENT_LOGIN_PROVIDER_KEY = "finders:recentLoginProvider";

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
