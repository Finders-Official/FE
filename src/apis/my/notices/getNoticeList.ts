import { axiosInstance } from "@/lib/axiosInstance";
import type {
  NoticeDetailResponse,
  NoticeListResponse,
  NoticeType,
} from "@/types/mypage/notice";

// params 옵션으로 type, page, size 등을 넘겨줌
export const getNoticeList = async (type: NoticeType, page = 0, size = 10) => {
  const { data } = await axiosInstance.get<NoticeListResponse>("/notices", {
    params: {
      type,
      page,
      size,
    },
  });

  return data;
};

// Path Variable로 noticeId를 전달받아 요청합니다.
export const getNoticeDetail = async (noticeId: number) => {
  const { data } = await axiosInstance.get<NoticeDetailResponse>(
    `/notices/${noticeId}`,
  );
  return data;
};
