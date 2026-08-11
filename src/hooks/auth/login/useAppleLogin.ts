import { useState } from "react";
import { loginWithApple } from "@/utils/auth/appleSdk";
import {
  setPendingSignupProvider,
  setRecentLoginProvider,
} from "@/utils/auth/recentLoginProvider";
import { tokenStorage } from "@/utils/tokenStorage";
import { useOauth } from "./useOauth";
import { useAuthStore } from "@/store/useAuth.store";
// 환경 체크 유틸 및 플러그인 임포트 추가
import { isNativeApp } from "@/utils/auth/envUtils";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";

type Props = {
  onExistingMember: () => void;
  onNewMember: () => void;
  onFail?: (message?: string) => void;
};

export function useAppleLogin({
  onExistingMember,
  onNewMember,
  onFail,
}: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const [isPopupPending, setIsPopupPending] = useState(false);

  const { mutate, isPending: isMutating } = useOauth({
    onSuccess: (res) => {
      const data = res.data;

      if ("accessToken" in data) {
        // 가입이 끝난 계정만 "최근 로그인"으로 기록 (신규 회원은 아직 계정이 없음)
        setRecentLoginProvider("APPLE");
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          signupToken: null,
        });
        setUser({ memberId: data.member.id, nickname: data.member.nickname });
        onExistingMember();
      } else {
        setPendingSignupProvider("APPLE");
        tokenStorage.setTokens({
          accessToken: null,
          signupToken: data.signupToken,
        });
        onNewMember();
      }
    },
    onError: () => onFail?.(),
  });

  const login = async () => {
    try {
      setIsPopupPending(true);
      let code = "";

      // 환경(앱 or 웹_에 따른 로직 분기
      if (isNativeApp()) {
        // Capacitor 네이티브 플러그인 호출
        const result = await SignInWithApple.authorize();

        // 플러그인 결과에서 authorizationCode 추출
        code = result.response.authorizationCode;
      } else {
        // 기존 웹 SDK 호출
        code = await loginWithApple();
      }

      if (!code) {
        throw new Error("인증 코드를 받아오지 못했습니다.");
      }

      // 백엔드로 코드 전송
      mutate({
        provider: "APPLE",
        credentialType: "AUTHORIZATION_CODE",
        credential: code,
      });
    } catch (e) {
      console.error("애플 로그인 에러:", e);
      onFail?.();
    } finally {
      setIsPopupPending(false);
    }
  };

  return { login, isPending: isPopupPending || isMutating };
}
