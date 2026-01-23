export type Status = "DEVELOP" | "SCAN" | "PRINT" | "DELIVERY";
export type SpecStep = "BEFORE" | "AFTER";
export type ReceiptMethod = "PICKUP" | "DELIVERY";

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

// 배송 상태
export type DeliveryStatus = "PENDING" | "SHIPPED" | "DELIVERED";

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
  print: PrintProgressResponse | null;
  delivery: DeliveryProgressResponse | null;
}

export type Process = {
  status: Status;
  specStep?: SpecStep;
  receiptMethod?: ReceiptMethod;
  print?: PrintProgressResponse;
  delivery?: DeliveryProgressResponse;
  deliveryInfo?: DeliveryInfo;
};

export const developMock: Process = {
  status: "DEVELOP",
};
export const scanMock: Process = {
  status: "SCAN",
};
export const printMock: Process = {
  status: "PRINT",
  specStep: "BEFORE",
  receiptMethod: "DELIVERY",
};
export const deliveryMock: Process = {
  status: "DELIVERY",
  specStep: "BEFORE",
  receiptMethod: "DELIVERY",
  deliveryInfo: {
    recipientName: "김필름",
    recipientPhone: "010-1234-5678",
    address: "서울 동작구 흑석로 123-123 (123호)",
  },
};

// PM-070-1: 현상소 확인 중
export const printPendingMock: Process = {
  status: "PRINT",
  specStep: "BEFORE",
  receiptMethod: "DELIVERY",
  print: {
    printOrderId: 101,
    status: "PENDING",
    receiptMethod: "DELIVERY",
    estimatedAt: null,
    completedAt: null,
  },
  deliveryInfo: {
    recipientName: "김필름",
    recipientPhone: "010-1234-5678",
    address: "서울 동작구 흑석로 123-123 (123호)",
  },
};

// PM-070-2: 인화 작업 진행 중
export const printConfirmedMock: Process = {
  status: "PRINT",
  specStep: "AFTER",
  receiptMethod: "DELIVERY",
  print: {
    printOrderId: 101,
    status: "PRINTING",
    receiptMethod: "DELIVERY",
    estimatedAt: "2026-01-17T15:00:00+09:00",
    completedAt: null,
  },
  deliveryInfo: {
    recipientName: "김필름",
    recipientPhone: "010-1234-5678",
    address: "서울 동작구 흑석로 123-123 (123호)",
  },
};

// 배송중
export const deliveryShippedMock: Process = {
  status: "DELIVERY",
  receiptMethod: "DELIVERY",
  delivery: {
    deliveryId: 1,
    status: "SHIPPED",
    carrier: "우체국 택배",
    trackingNumber: "123412341234",
    shippedAt: "2026-01-17T10:00:00+09:00",
    deliveredAt: null,
  },
  deliveryInfo: {
    recipientName: "파인더스 상도점",
    recipientPhone: "010-1234-5678",
    address: "서울 동작구 흑석로 123-123 (123호)",
  },
};

// 배송 완료
export const deliveryCompletedMock: Process = {
  status: "DELIVERY",
  receiptMethod: "DELIVERY",
  delivery: {
    deliveryId: 1,
    status: "DELIVERED",
    carrier: "우체국 택배",
    trackingNumber: "123412341234",
    shippedAt: "2026-01-17T10:00:00+09:00",
    deliveredAt: "2026-01-19T14:30:00+09:00",
  },
  deliveryInfo: {
    recipientName: "파인더스 상도점",
    recipientPhone: "010-1234-5678",
    address: "서울 동작구 흑석로 123-123 (123호)",
  },
};

export const mocks = {
  develop: developMock,
  scan: scanMock,
  print: printMock,
  delivery: deliveryMock,
  printPending: printPendingMock,
  printConfirmed: printConfirmedMock,
  deliveryShipped: deliveryShippedMock,
  deliveryCompleted: deliveryCompletedMock,
} as const;
