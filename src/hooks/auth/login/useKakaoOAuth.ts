import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { consumeAndValidateKakaoState } from "@/utils/auth/kakaoOauth";
import { tokenStorage } from "@/utils/tokenStorage";
import { useOauth } from "./useOauth";
import { useAuthStore } from "@/store/useAuth.store";
import { me } from "@/apis/member/me.api";

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
    onSuccess: async (res) => {
      tokenStorage.setTokens({
        accessToken: res.data.accessToken ?? tokenStorage.getAccessToken(),
        refreshToken: res.data.refreshToken ?? tokenStorage.getRefreshToken(),
        signupToken: res.data.signupToken ?? tokenStorage.getSignupToken(),
      });

      if (!res.data.isNewMember) {
        // 기존 회원이면 내 정보 조회 후 스토어 업데이트
        try {
          const myData = await me();
          const memberId = myData.data.member.memberId;

          let nickname = "";
          const { role, user, owner, admin } = myData.data.roleData;
          if (role === "USER" && user) nickname = user.nickname;
          else if (role === "OWNER" && owner) nickname = owner.nickname;
          else if (role === "ADMIN" && admin) nickname = admin.nickname;

          setUser({ memberId, nickname });
          onExistingMember();
        } catch (e) {
          console.error("Failed to fetch user info after login", e);
          onFail?.("사용자 정보를 불러오는데 실패했습니다.");
        }
      } else {
        onNewMember();
      }
    },
    onError: () => onFail?.(),
  });
  //이미 존재하는 회원인지 신규 회원인지에 따른 분기 처리
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
