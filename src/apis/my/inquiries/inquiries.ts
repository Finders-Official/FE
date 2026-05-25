import { axiosInstance } from "@/lib/axiosInstance";
import type { InquiryListResponse } from "@/types/mypage/inquiry";

export const getInquiries = async (page = 0, size = 10) => {
  const { data } = await axiosInstance.get<InquiryListResponse>("/inquiries", {
    params: {
      page,
      size,
    },
  });
  return data;
};
