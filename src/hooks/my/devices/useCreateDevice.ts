import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchUpdateDevice, postCreateDevice } from "@/apis/my";

export const useCreateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCreateDevice,
    onSuccess: () => {
      // 등록 성공 시 장비 목록 쿼리 캐시 무효화 -> 자동 최신화 리로드 트리거
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error) => {
      console.error("장비 등록 실패:", error);
    },
  });
};

export const useUpdateDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchUpdateDevice,
    onSuccess: () => {
      // 수정 성공 시 기존 리스트 캐시를 무효화하여 최신 데이터로 리로드
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
    onError: (error) => {
      console.error("장비 수정 실패:", error);
    },
  });
};
