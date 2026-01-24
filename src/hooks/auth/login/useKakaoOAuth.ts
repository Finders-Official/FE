import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { consumeAndValidateKakaoState } from "@/utils/auth/kakaoOauth";
import { tokenStorage } from "@/utils/tokenStorage";
import { useOauth } from "./useOauth";

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

  const code = sp.get("code");
  const error = sp.get("error");
  const state = sp.get("state");

  const { mutate, isPending } = useOauth({
    onSuccess: (res) => {
      tokenStorage.setTokens({
        accessToken: res.data.accessToken ?? tokenStorage.getAccessToken(),
        refreshToken: res.data.refreshToken ?? tokenStorage.getRefreshToken(),
        signupToken: res.data.signupToken ?? tokenStorage.getSignupToken(),
      });
      if (res.data.isExistingMember) onExistingMember();
      else onNewMember();
    },
    onError: () => onFail?.(),
  });

  useEffect(() => {
    if (didRun.current) return;
    if (error) return;
    if (!code) return;

    // state 검증 통과해야만 진행
    if (!consumeAndValidateKakaoState(state)) return;

    didRun.current = true;
    mutate({ provider: "KAKAO", code });
  }, [code, error, state, mutate]);

  return { isPending };
}
