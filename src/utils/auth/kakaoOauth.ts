const KAKAO_STATE_KEY = "finders:kakaoOAuthState";

function createState() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

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

  return `${base}?${qs.toString()}`;
}

export function consumeAndValidateKakaoState(returnedState: string | null) {
  const expected = sessionStorage.getItem(KAKAO_STATE_KEY);
  if (!expected || !returnedState || expected !== returnedState) return false;
  sessionStorage.removeItem(KAKAO_STATE_KEY);
  return true;
}
