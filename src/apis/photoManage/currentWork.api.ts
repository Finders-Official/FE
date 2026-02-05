import { axiosInstance } from "@/lib/axiosInstance";
import type { MyCurrentWorkResponse } from "@/types/photomanage/process";

export const getCurrentWork = async (): Promise<{
  data: MyCurrentWorkResponse | null;
}> => {
  const { data } = await axiosInstance.get("/photos/current-work");
  return data;
};
