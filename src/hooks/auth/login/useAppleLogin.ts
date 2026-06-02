import { useState } from "react";
import { loginWithApple } from "@/utils/auth/appleSdk";
import { tokenStorage } from "@/utils/tokenStorage";
import { useOauth } from "./useOauth";
import { useAuthStore } from "@/store/useAuth.store";

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
        // 기존 회원: accessToken 저장 후 메인으로 (refreshToken은 httpOnly 쿠키)
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          signupToken: null,
        });
        setUser({ memberId: data.member.id, nickname: data.member.nickname });
        onExistingMember();
      } else {
        // 신규 회원: signupToken 저장 후 약관 동의로
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
      const code = await loginWithApple();
      mutate({
        provider: "APPLE",
        credentialType: "AUTHORIZATION_CODE",
        credential: code,
      });
    } catch (e) {
      // 사용자가 팝업을 닫거나 SDK 로드 실패/환경변수 누락 등
      console.error(e);
      onFail?.();
    } finally {
      setIsPopupPending(false);
    }
  };

  return { login, isPending: isPopupPending || isMutating };
}
