import { getNoticeDetail } from "@/apis/my";
import { useQuery } from "@tanstack/react-query";

export const useNoticeDetail = (noticeId: string | null) => {
  return useQuery({
    // noticeId가 바뀔 때마다 새 데이터를 캐싱 및 조회하도록 설정
    queryKey: ["noticeDetail", noticeId],
    queryFn: () => getNoticeDetail(noticeId!),
    // 방어 코드: id가 유효한 값으로 넘어왔을 때만 API 요청을 보냄
    enabled: typeof noticeId === "string" && noticeId.length > 0,
  });
};
