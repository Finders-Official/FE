import type { CreditHistoryItem, CreditProduct } from "@/types/credit";

// UI 작업 임시 데이터 — Phase 6 이후 실제 API 연결 시 삭제 예정.
export const MOCK_CURRENT_CREDIT = 2;

export const MOCK_CREDIT_PRODUCTS: CreditProduct[] = [
  { productId: "p-10", name: "크레딧 10개", creditAmount: 10, price: 2900 },
  { productId: "p-22", name: "크레딧 22개", creditAmount: 22, price: 5800 },
  { productId: "p-34", name: "크레딧 34개", creditAmount: 34, price: 8700 },
  { productId: "p-46", name: "크레딧 46개", creditAmount: 46, price: 11600 },
  { productId: "p-58", name: "크레딧 58개", creditAmount: 58, price: 14500 },
];

export const MOCK_CREDIT_HISTORIES: CreditHistoryItem[] = [
  { title: "AI 사진복원", date: "2026.05.14", amount: -1, balanceAfter: 12 },
  {
    title: "크레딧 10개 충전",
    date: "2026.05.14",
    amount: 10,
    balanceAfter: 13,
  },
  {
    title: "가입축하 크레딧 증정",
    date: "2026.04.23",
    amount: 3,
    balanceAfter: 3,
  },
];
