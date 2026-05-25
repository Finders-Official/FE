import { useQuery } from "@tanstack/react-query";
import type { NoticeType } from "@/types/mypage/notice";
import { getNoticeList } from "@/apis/my";

export const useGetNoticeList = (type: NoticeType, page = 0, size = 10) => {
  return useQuery({
    // queryKey에 type과 page를 넣어 탭이나 페이지가 바뀔 때마다 데이터를 캐싱/재조회하도록 함
    queryKey: ["notices", type, page, size],
    queryFn: () => getNoticeList(type, page, size),
    // 필요하다면 staleTime 등을 설정
    // staleTime: 1000 * 60 * 5,
  });
};
