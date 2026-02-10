// 작업 진행 단계
export type Status = "DEVELOP" | "SCAN" | "PRINT" | "DELIVERY";

// 수령 방식
export type ReceiptMethod = "PICKUP" | "DELIVERY";

// 배송 상태
export type DeliveryStatus = "PENDING" | "SHIPPED" | "DELIVERED";

// 현상 주문 상태
export type DevelopmentStatus =
  | "RECEIVED"
  | "DEVELOPING"
  | "SCANNING"
  | "COMPLETED";

// 인화 주문 상태
export type PrintOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PRINTING"
  | "READY"
  | "SHIPPED"
  | "COMPLETED";

// 인화 진행 상태
export interface PrintProgressResponse {
  printOrderId: number;
  status: PrintOrderStatus;
  receiptMethod: ReceiptMethod;
  estimatedAt: string | null;
  completedAt: string | null;
}

// 배송 진행 상태
export interface DeliveryProgressResponse {
  deliveryId: number;
  status: DeliveryStatus;
  recipient: string | null;
  recipientNumber: string | null;
  recipientAddress: string | null;
  AddressDetail: string | null;
  sender: string | null;
  carrier: string | null;
  trackingNumber: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
}

// 배송지 정보
export interface DeliveryInfo {
  recipientName: string;
  recipientPhone: string;
  address: string;
}

// 내 진행중 작업 응답
export interface MyCurrentWorkResponse {
  developmentOrderId: number;
  photoLabId: number;
  photoLabName: string;
  developmentStatus: DevelopmentStatus;
  createdAt: string;
  completedAt: string;
  print: PrintProgressResponse | null;
  delivery: DeliveryProgressResponse | null;
}

export type StepConfig = {
  key: string;
  step: Status; // 작업 진행 단계
  receiptMethod?: ReceiptMethod; // 수령 방식
  isCurrent: boolean; // 현재 진행 여부
  title: string;
  content: React.ReactNode;
  index: number;
  subComment?: React.ReactNode;
  buttons?: React.ReactNode;
  isLast?: boolean;
};
