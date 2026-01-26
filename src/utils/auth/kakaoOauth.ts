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
  const clientId = import.meta.env.VITE_PUBLIC_KAKAO_REST_API_KEY as string;
  const redirectUri = import.meta.env.VITE_PUBLIC_KAKAO_REDIRECT_URI as string;

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
  console.log("[KAKAO] authorize url =", url);

  return url;
}

// 콜백에서 state 검증 -> 세션에 저장한 state와 카카오가 돌려준 stater가 일치하는 지 검증
export function consumeAndValidateKakaoState(returnedState: string | null) {
  const expected = sessionStorage.getItem(KAKAO_STATE_KEY);
  if (!expected || !returnedState || expected !== returnedState) return false;
  sessionStorage.removeItem(KAKAO_STATE_KEY);
  return true;
}
