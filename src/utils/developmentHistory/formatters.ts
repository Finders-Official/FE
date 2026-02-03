import type { DevelopmentOrder } from "@/types/developmentHistory/developmentHistory";

// 요일 계산을 위한 배열
const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];

export const formatDevelopmentOrder = (order: DevelopmentOrder) => {
  const dateObj = new Date(order.createdAt);
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  const weekDay = WEEK_DAYS[dateObj.getDay()];

  // taskTypes 한글 변환 및 태그 조합
  const taskMap: Record<string, string> = {
    DEVELOP: "현상",
    SCAN: "스캔",
    PRINT: "인화",
  };
  const taskTags = order.taskTypes.map((t) => taskMap[t] || t).join(" · ");

  return {
    id: order.developmentOrderId,
    shopName: order.photoLabName,
    shopAddress: order.photoLabAddress,
    status: order.deliveryAddress ? "배송" : "직접 수령", // 배송지 정보 유무로 판단
    date: `${month}/${day}(${weekDay})`,
    tags: `${taskTags} · ${order.rollCount}롤`,
    price: order.totalPrice,
    deliveryAddress: order.deliveryAddress
      ? `${order.deliveryAddress} ${order.deliveryAddressDetail}`
      : undefined,
    thumbnailUrl: order.previewImageUrls[0] || "", // 첫 번째 이미지를 썸네일로
    resultImageUrls: order.previewImageUrls as string[],
  };
};
