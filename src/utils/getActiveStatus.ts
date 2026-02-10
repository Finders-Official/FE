import type {
  DevelopmentStatus,
  MyCurrentWorkResponse,
  Status,
} from "@/types/photomanage/process";

export function getActiveStatus(
  workData: MyCurrentWorkResponse | null | undefined,
): Status {
  if (!workData) return "DEVELOP";

  if (workData.delivery?.status === "PENDING") return "PRINT";
  else if (
    workData.delivery?.status === "SHIPPED" ||
    workData.delivery?.status === "DELIVERED"
  )
    return "DELIVERY";

  const devStatusMap: Record<DevelopmentStatus, Status> = {
    RECEIVED: "DEVELOP",
    DEVELOPING: "DEVELOP",
    SCANNING: "SCAN",
    COMPLETED: "SCAN",
  };

  return devStatusMap[workData.developmentStatus] ?? "DEVELOP";
}
