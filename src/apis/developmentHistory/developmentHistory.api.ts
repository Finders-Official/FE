import { axiosInstance } from "@/lib/axiosInstance";
import type { DevelopmentOrdersResponse } from "@/types/developmentHistory/developmentHistory";

export const getDevelopmentOrders = async (
  page: number = 0,
  size: number = 10,
) => {
  const { data } = await axiosInstance.get<DevelopmentOrdersResponse>(
    `/photos/development-orders`,
    {
      params: { page, size },
    },
  );
  return data;
};
