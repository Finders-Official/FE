import { axiosInstance } from "@/lib/axiosInstance";
import type { EquipmentListResponse } from "@/types/mypage/device";
import { isAxiosError } from "axios";

// 장비 조회 api
export const getDeviceList = async (cursor?: string, size = 10) => {
  try {
    const { data } = await axiosInstance.get<EquipmentListResponse>(
      "/devices",
      {
        params: {
          cursor,
          size,
        },
      },
    );
    return data;
  } catch (error) {
    // 💡 에러가 발생했을 때, 해당 에러가 "장비가 없음" 에러인지 확인합니다.
    if (
      isAxiosError(error) &&
      error.response?.data?.code === "EQUIPMENT_404_EMPTY"
    ) {
      // 장비가 없는 건 진짜 에러가 아니므로, 프론트엔드에서 빈 리스트 응답으로 둔갑시켜 반환합니다.
      return {
        success: true,
        code: "SUCCESS",
        message: "장비가 없습니다.",
        timestamp: new Date().toISOString(),
        data: {
          items: [],
          nextCursor: null,
          hasNext: false,
        },
      } as EquipmentListResponse;
    }
    throw error;
  }
};
