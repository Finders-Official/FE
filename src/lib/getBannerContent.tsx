import {
  DeliveryPicIcon,
  DevelopPicIcon,
  PrintPicIcon,
  ScanPicIcon,
} from "@/assets/icon";
import type { ReceiptMethod, Status } from "@/types/photomanage/process";

export function getBannerContent(params: {
  status: Status;
  receiptMethod?: ReceiptMethod;
  printStatus?: string;
}) {
  const { status, receiptMethod, printStatus } = params;

  const bannerMap = {
    DEVELOP: {
      icon: <DevelopPicIcon />,
      title: "필름 현상중이에요",
      content: "현상이 완료되면 이곳에서 사진을 볼 수 있어요!",
    },
    SCAN: {
      icon: <ScanPicIcon />,
      title: "현상된 필름이 스캔 완료되었어요",
      content: "인화 신청과 사진 다운로드를 해주세요!",
    },
    PRINT: {
      icon: <PrintPicIcon />,
      title:
        printStatus === "PENDING"
          ? "현상소에서 확인 중이에요"
          : "인화 작업이 진행 중이에요",
      content: "배송이 시작되면 알려드릴게요!",
    },
    DELIVERY: {
      icon: <DeliveryPicIcon />,
      title:
        receiptMethod === "PICKUP"
          ? "사진 수령이 가능해요"
          : "사진을 배송하고 있어요",
      content:
        receiptMethod === "PICKUP"
          ? "현상소에 방문하여 사진을 찾아주세요!"
          : "현상소에서 발송된 사진이 이동 중이에요!",
    },
  };
  return bannerMap[status];
}
