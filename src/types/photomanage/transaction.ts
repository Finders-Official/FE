export interface BankInfo {
  code: string;
  name: string;
  type: "bank" | "securities";
}

export interface LabAccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string; // 마스킹된 이름 (예: 박*상)
}

export interface TransactionRouteState {
  photoLabId: number;
  printOrderId: number;
  totalPrice: number;
  receiptMethod: "PICKUP" | "DELIVERY";
  labAccountInfo: LabAccountInfo;
}

export interface TransactionFormState {
  depositorName: string;
  selectedBank: BankInfo | null;
  paymentProofImage: File | null;
  paymentProofPreview: string | null;
}
