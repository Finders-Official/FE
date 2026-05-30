import { deleteDevice } from "@/apis/my";
import type { EquipmentListResponse } from "@/types/mypage/device";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export const useDeleteDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDevice,
    // onMutate: API 요청을 보내기 직전에 실행 (UI 먼저 반영)
    onMutate: async (deletedId) => {
      // 겹치는 요청이 없도록 기존 진행 중인 쿼리를 취소
      await queryClient.cancelQueries({ queryKey: ["equipments"] });

      // 에러 났을 때 롤백하기 위해 기존 캐시 데이터 백업
      const previousEquipments = queryClient.getQueryData(["equipments"]);

      // 무한 스크롤 데이터 구조에 맞춰 캐시 데이터(UI) 즉시 삭제
      queryClient.setQueriesData(
        { queryKey: ["equipments"] },
        (oldData: InfiniteData<EquipmentListResponse> | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: EquipmentListResponse) => ({
              ...page,
              data: {
                ...page.data,
                // 지우려는 ID와 일치하지 않는 것만 남김 -> 삭제 반영
                items: page.data.items.filter(
                  (item) => item.combinationId !== deletedId,
                ),
              },
            })),
          };
        },
      );

      // 백업해둔 데이터를 context로 넘김
      return { previousEquipments };
    },
    // onError: API 요청이 실패하면 백업해둔 데이터로 다시 롤백
    onError: (err, deletedId, context) => {
      if (context?.previousEquipments) {
        queryClient.setQueryData(["equipments"], context.previousEquipments);
      }
      console.error("장비 삭제 실패:", err, deletedId);
    },
    // onSettled: 성공하든 실패하든 서버 데이터와 싱크를 맞추기 위해 캐시 무효화
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
    },
  });
};
