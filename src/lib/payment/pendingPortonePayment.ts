import type { CreditProduct } from "@/types/credit";

const STORAGE_KEY = "portone-pending-payment";

// 리다이렉트 결제 복귀 시 결과 화면 복원용 스냅샷 (requestPayment 호출 전에 저장)
export interface PendingPortonePayment {
  paymentId: string;
  product: CreditProduct;
  methodLabel: string;
}

function isPendingPortonePayment(
  value: unknown,
): value is PendingPortonePayment {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.paymentId === "string" &&
    typeof record.methodLabel === "string" &&
    typeof record.product === "object" &&
    record.product !== null
  );
}

export function savePendingPortonePayment(
  pending: PendingPortonePayment,
): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(pending));
}

export function loadPendingPortonePayment(
  paymentId: string,
): PendingPortonePayment | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isPendingPortonePayment(parsed) || parsed.paymentId !== paymentId) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingPortonePayment(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
