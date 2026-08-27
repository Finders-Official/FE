import { reviewLogin } from "@/apis/auth";
import { useAuthStore } from "@/store/useAuth.store";
import type { ReviewLoginData, ReviewLoginReq } from "@/types/auth";
import type { ApiResponse } from "@/types/common/apiResponse";
import { tokenStorage } from "@/utils/tokenStorage";
import { useMutation } from "@tanstack/react-query";

type Response = ApiResponse<ReviewLoginData>;

type Options = {
  onSuccess?: () => void;
  onError?: (message: string) => void;
};

/**
 * 스토어 심사용 로그인.
 *
 * 서버가 소셜 로그인 기존 회원과 동일한 형태로 응답하므로, 토큰 저장과 전역 사용자 설정도
 * 소셜 로그인 성공 경로와 같은 순서로 처리한다. 심사 경로만 다르게 동작하면 심사관이 보는
 * 화면과 실제 사용자가 보는 화면이 갈라져 사각지대가 생긴다.
 */
export function useReviewLogin(options?: Options) {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<Response, Error, ReviewLoginReq>({
    mutationKey: ["auth", "reviewLogin"],
    mutationFn: (vars) => reviewLogin(vars),
    onSuccess: async (res) => {
      const { accessToken, member } = res.data;

      await tokenStorage.setTokens({ accessToken, signupToken: null });
      setUser({ memberId: member.id, nickname: member.nickname });

      options?.onSuccess?.();
    },
    onError: (error) => {
      options?.onError?.(error.message);
    },
  });
}
