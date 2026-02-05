// src/apis/photoManage/currentWork.api.ts
import { axiosInstance } from "@/lib/axiosInstance";
import type { CurrentWorkResponse } from "@/types/photomanage/currentWork";

export const getCurrentWork = async (): Promise<CurrentWorkResponse> => {
  const { data } = await axiosInstance.get("/photos/current-work");
  return data;
};
