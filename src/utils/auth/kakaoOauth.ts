import { isNativeApp } from "./envUtils";

// 상태 저장 키
const KAKAO_STATE_KEY = "finders:kakaoOAuthState";

// 랜덤 state 생성: 로그인 요청을 시작했는지 확인해주는 표식
function createState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// kakao Authorize url 생성하기
export function buildKakaoAuthorizeUrl() {
  // 현재 환경이 패키징 앱 안인지 일반 웹 브라우저인지 판별
  const isApp = isNativeApp();

  // 환경에 따라 다른 환경변수 할당
  const clientId = isApp
    ? (import.meta.env.VITE_KAKAO_NATIVE_APP_KEY as string)
    : (import.meta.env.VITE_PUBLIC_KAKAO_REST_API_KEY as string);

  const redirectUri = isApp
    ? `kakao${import.meta.env.VITE_KAKAO_NATIVE_APP_KEY as string}://oauth`
    : (import.meta.env.VITE_PUBLIC_KAKAO_REDIRECT_URI as string);
  const state = createState();
  sessionStorage.setItem(KAKAO_STATE_KEY, state);

  const base = "https://kauth.kakao.com/oauth/authorize";
  const qs = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });

  const url = `${base}?${qs.toString()}`;

  return url;
}

// 콜백에서 state 검증 -> 세션에 저장한 state와 카카오가 돌려준 stater가 일치하는 지 검증
export function consumeAndValidateKakaoState(returnedState: string | null) {
  const expected = sessionStorage.getItem(KAKAO_STATE_KEY);
  if (!expected || !returnedState || expected !== returnedState) return false;
  sessionStorage.removeItem(KAKAO_STATE_KEY);
  return true;
}
