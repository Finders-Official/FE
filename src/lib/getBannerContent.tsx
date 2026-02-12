import { deliveryPic, developPic, printPic, scanPic } from "@/assets/images";
import type {
  DeliveryStatus,
  PrintOrderStatus,
  ReceiptMethod,
  Status,
} from "@/types/photomanage/process";

export function getBannerContent(params: {
  status: Status;
  receiptMethod?: ReceiptMethod;
  printStatus?: PrintOrderStatus;
  deliveryStatus?: DeliveryStatus;
}) {
  const { status, receiptMethod, printStatus, deliveryStatus } = params;

  // 수령/배송 단계 타이틀
  const deliveryTitle = () => {
    if (receiptMethod === "DELIVERY") {
      if (deliveryStatus === "SHIPPED") {
        return "사진을 배송하고 있어요";
      } else if (deliveryStatus === "DELIVERED") {
        return "사진이 안전하게 배송되었어요";
      } else return null;
    } else if (receiptMethod === "PICKUP") {
      if (printStatus === "READY") {
        return "인화 작업이 완료되었어요";
      } else if (printStatus === "COMPLETED") {
        return "사진 수령이 완료되었어요";
      } else return null;
    }
  };

  // 수령/배송 단계 콘텐츠
  const deliveryContent = () => {
    if (receiptMethod === "DELIVERY") {
      if (deliveryStatus === "SHIPPED") {
        return "현상소에서 발송된 사진이 안전하게 이동 중이에요!";
      } else if (deliveryStatus === "DELIVERED") {
        return "발송된 사진을 확인 후, 수령 확정해주세요!";
      } else return null;
    } else if (receiptMethod === "PICKUP") {
      if (printStatus === "READY") {
        return "소중한 결과물을 수령해가세요!";
      } else if (printStatus === "COMPLETED") {
        return "수령한 사진을 확인 후, 수령 확정해주세요!";
      } else return null;
    }
  };

  const bannerMap = {
    DEVELOP: {
      icon: <img src={developPic} alt="현상" />,
      title: "필름 현상중이에요",
      content: "현상이 완료되면 이곳에서 사진을 볼 수 있어요!",
    },
    SCAN: {
      icon: <img src={scanPic} alt="스캔" />,
      title: "현상된 필름이 스캔 완료되었어요",
      content: "인화 신청과 사진 다운로드를 해주세요!",
    },
    PRINT: {
      icon: <img src={printPic} alt="인화" />,
      title:
        printStatus === "PENDING"
          ? "현상소에서 인화신청을 확인 중이에요"
          : "인화 작업이 진행 중이에요",
      content:
        printStatus === "PENDING"
          ? "인화가 확인되면 완료 시간을 알 수 있어요!"
          : "배송이 시작되면 알려드릴게요!",
    },
    DELIVERY: {
      icon: <img src={deliveryPic} alt="배송" />,
      title: deliveryTitle(),
      content: deliveryContent(),
    },
  };
  return bannerMap[status];
}
