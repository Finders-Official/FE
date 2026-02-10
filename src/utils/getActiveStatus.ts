import type {
  DevelopmentStatus,
  MyCurrentWorkResponse,
  Status,
} from "@/types/photomanage/process";

export function getActiveStatus(
  workData: MyCurrentWorkResponse | null | undefined,
): Status {
  if (!workData) return "DEVELOP";

  if (
    workData.print?.status === "PENDING" ||
    workData.print?.status === "PRINTING"
  )
    return "PRINT";

  if (
    workData.print?.status === "READY" ||
    workData.print?.status === "COMPLETED"
  )
    return "DELIVERY";
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
