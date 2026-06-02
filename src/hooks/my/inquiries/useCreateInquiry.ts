import { postInquiry } from "@/apis/my";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateInquiry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postInquiry,
    onSuccess: () => {
      // 작성 성공 시, 기존 문의 내역 쿼리를 만료시켜서 리스트 화면으로 갔을 때 새 데이터를 불러오게 함
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
    },
    onError: (error) => {
      console.error("문의 작성 실패:", error);
    },
  });
};
