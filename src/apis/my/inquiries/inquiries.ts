import { axiosInstance } from "@/lib/axiosInstance";
import type {
  CreateInquiryRequest,
  InquiryListResponse,
} from "@/types/mypage/inquiry";

export const getInquiries = async (page = 0, size = 10) => {
  const { data } = await axiosInstance.get<InquiryListResponse>("/inquiries", {
    params: {
      page,
      size,
    },
  });
  return data;
};

// 문의 작성 POST API
export const postInquiry = async (data: CreateInquiryRequest) => {
  const response = await axiosInstance.post("/inquiries", data);
  return response.data;
};
