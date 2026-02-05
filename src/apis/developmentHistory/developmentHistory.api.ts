import { axiosInstance } from "@/lib/axiosInstance";
import type { DevelopmentOrdersResponse } from "@/types/developmentHistory/developmentHistory";

export const getDevelopmentOrders = async (page = 0, size = 10) => {
  const { data } = await axiosInstance.get<DevelopmentOrdersResponse>(
    `/photos/development-orders`,
    { params: { page, size } },
  );

  const updatedData = data.data.map((order) => {
    // 30일 뒤 만료일 계산
    const expiryDate = new Date(order.createdAt);
    expiryDate.setDate(expiryDate.getDate() + 30);

    const formattedExpiry = `${expiryDate.getFullYear()}.${String(expiryDate.getMonth() + 1).padStart(2, "0")}.${String(expiryDate.getDate()).padStart(2, "0")}`;

    return {
      ...order,
      expiryDate: formattedExpiry,
    };
  });

  return {
    ...data,
    data: updatedData,
  };
};
