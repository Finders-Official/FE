import type { Status } from "@/types/photomanage/process";

export const STATUS_INDEX_MAP: Record<Status, number> = {
  DEVELOP: 1,
  SCAN: 2,
  PRINT: 3,
  DELIVERY: 4,
};
