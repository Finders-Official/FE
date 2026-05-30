import { axiosInstance } from "@/lib/axiosInstance";
import type {
  CatalogResponse,
  CreateDeviceRequest,
  CreateDeviceResponse,
  EquipmentListResponse,
} from "@/types/mypage/device";
import { isAxiosError } from "axios";

// 장비 조회 api
export const getDeviceList = async (cursor?: string, size = 10) => {
  try {
    const { data } = await axiosInstance.get<EquipmentListResponse>(
      "/equipment/combinations",
      {
        params: {
          cursor,
          size,
        },
      },
    );
    return data;
  } catch (error) {
    // 에러가 발생했을 때, 해당 에러가 "장비가 없음" 에러인지 확인
    if (
      isAxiosError(error) &&
      error.response?.data?.code === "EQUIPMENT_404_EMPTY"
    ) {
      // 장비가 없는 경우 빈 리스트 응답으로 둔갑시켜 반환
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

// 장비 제거 api
export const deleteDevice = async (combinationId: string) => {
  const { data } = await axiosInstance.delete(
    `/equipment/combinations/${combinationId}`,
  );
  return data;
};

// 카메라 기종 조회 api
export const getCameraCatalog = async (
  keyword: string,
  cursor?: string,
  size = 10,
) => {
  const { data } = await axiosInstance.get<CatalogResponse>(
    "/equipment/catalog/cameras",
    {
      params: { keyword, cursor, size },
    },
  );
  return data;
};

// 필름 기종 조회 api
export const getFilmCatalog = async (
  keyword: string,
  cursor?: string,
  size = 10,
) => {
  const { data } = await axiosInstance.get<CatalogResponse>(
    "/equipment/catalog/films",
    {
      params: { keyword, cursor, size },
    },
  );
  return data;
};

// 내 장비 등록 api
export const postCreateDevice = async (body: CreateDeviceRequest) => {
  try {
    const { data } = await axiosInstance.post<CreateDeviceResponse>(
      "/equipment/combinations",
      body,
    );
    return data;
  } catch (error) {
    // 여기서 백엔드 에러 코드를 확인하고 프론트엔드 전용 에러로 변환해서 던짐
    if (
      isAxiosError(error) &&
      error.response?.data?.code === "EQUIPMENT_409_DUPLICATED"
    ) {
      throw new Error("DUPLICATED");
    }
    throw error;
  }
};

// 내 장비 수정 API
export const patchUpdateDevice = async ({
  combinationId,
  body,
}: {
  combinationId: string;
  body: CreateDeviceRequest;
}) => {
  try {
    const { data } = await axiosInstance.patch<CreateDeviceResponse>(
      `/equipment/combinations/${combinationId}`,
      body,
    );
    return data;
  } catch (error) {
    // 수정 API에서도 동일하게 처리
    if (
      isAxiosError(error) &&
      error.response?.data?.code === "EQUIPMENT_409_DUPLICATED"
    ) {
      throw new Error("DUPLICATED");
    }
    throw error;
  }
};
