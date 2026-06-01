// Apple Sign in (JS SDK, 팝업 방식)
// 웹은 localhost redirect 미지원 → prod redirect URI만 사용. dev에선 팝업이 뜨지 않을 수 있음.
const APPLE_SDK_SRC =
  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";

type AppleSignInResponse = {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    name?: { firstName?: string; lastName?: string };
    email?: string;
  };
};

type AppleAuth = {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    state?: string;
    usePopup: boolean;
  }) => void;
  signIn: () => Promise<AppleSignInResponse>;
};

declare global {
  interface Window {
    AppleID?: { auth: AppleAuth };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadAppleSdk(): Promise<void> {
  if (window.AppleID) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = APPLE_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Apple SDK 로드에 실패했습니다."));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

let initialized = false;

async function ensureAppleAuth(): Promise<AppleAuth> {
  await loadAppleSdk();

  const appleId = window.AppleID;
  if (!appleId) throw new Error("Apple SDK를 사용할 수 없습니다.");

  if (!initialized) {
    appleId.auth.init({
      clientId: import.meta.env.VITE_PUBLIC_APPLE_CLIENT_ID as string,
      scope: "name email",
      redirectURI: import.meta.env.VITE_PUBLIC_APPLE_REDIRECT_URI as string,
      usePopup: true,
    });
    initialized = true;
  }

  return appleId.auth;
}

// 애플 로그인 팝업 → authorization code 반환
export async function loginWithApple(): Promise<string> {
  const auth = await ensureAppleAuth();
  const res = await auth.signIn();
  return res.authorization.code;
}
