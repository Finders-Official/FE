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

// 입금 확인 API

export interface DepositReceiptConfirmRequest {
  objectPath: string;
  depositorName: string;
  depositBankName: string;
}

// 백엔드 응답 필드명 기준. hook select에서 LabAccountInfo로 매핑
export interface PhotoLabAccountResponse {
  bankName: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
}
