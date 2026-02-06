import type {
  DevelopmentStatus,
  MyCurrentWorkResponse,
  Status,
} from "@/types/photomanage/process";

export function getActiveStatus(
  workData: MyCurrentWorkResponse | null | undefined,
): Status {
  if (!workData) return "DEVELOP";

  if (workData.delivery?.deliveryId != null) return "DELIVERY";
  if (workData.print?.printOrderId != null) return "PRINT";

  const devStatusMap: Record<DevelopmentStatus, Status> = {
    RECEIVED: "DEVELOP",
    DEVELOPING: "DEVELOP",
    SCANNING: "SCAN",
    COMPLETED: "SCAN",
  };

  return devStatusMap[workData.developmentStatus] ?? "DEVELOP";
}
