import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { consumeAndValidateKakaoState } from "@/utils/auth/kakaoOauth";
import { setRecentLoginProvider } from "@/utils/auth/recentLoginProvider";
import { tokenStorage } from "@/utils/tokenStorage";
import { useOauth } from "./useOauth";
import { useAuthStore } from "@/store/useAuth.store";

type Props = {
  onExistingMember: () => void;
  onNewMember: () => void;
  onFail?: (message?: string) => void;
};

export function useKakaoOauth({
  onExistingMember,
  onNewMember,
  onFail,
}: Props) {
  const [sp] = useSearchParams();
  const didRun = useRef(false);
  const setUser = useAuthStore((state) => state.setUser);

  const code = sp.get("code");
  const error = sp.get("error");
  const state = sp.get("state");

  const { mutate, isPending } = useOauth({
    onSuccess: (res) => {
      const data = res.data;

      setRecentLoginProvider("KAKAO");

      if ("accessToken" in data) {
        // 기존 회원: accessToken 저장 후 메인으로 (refreshToken은 httpOnly 쿠키)
        tokenStorage.setTokens({
          accessToken: data.accessToken,
          signupToken: null,
        });
        setUser({ memberId: data.member.id, nickname: data.member.nickname });
        onExistingMember();
      } else {
        // 신규 회원: signupToken 저장 후 온보딩으로
        tokenStorage.setTokens({
          accessToken: null,
          signupToken: data.signupToken,
        });
        onNewMember();
      }
    },
    onError: () => onFail?.(),
  });

  //이미 존재하는 회원인지 신규 회원인지에 따른 분기 처리
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    // 실패(취소/거부/비정상 접근/콜백 새로고침 등)는 모두 로그인으로
    if (error || !code || !consumeAndValidateKakaoState(state)) {
      onFail?.();
      return;
    }

    mutate({
      provider: "KAKAO",
      credentialType: "AUTHORIZATION_CODE",
      credential: code,
    });
  }, [code, error, state, mutate, onFail]);

  return { isPending };
}
