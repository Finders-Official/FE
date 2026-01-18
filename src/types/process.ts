export type Status = "DEVELOP" | "SCAN" | "PRINT" | "DELIVERY";
export type SpecStep = "BEFORE" | "AFTER";
export type ReceiptMethod = "PICKUP" | "DELIVERY";

export type Process = {
  status: Status;
  specStep?: SpecStep;
  receiptMethod?: ReceiptMethod;
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
  receiptMethod: "PICKUP",
};

export const mocks = {
  develop: developMock,
  scan: scanMock,
  print: printMock,
  delivery: deliveryMock,
} as const;
