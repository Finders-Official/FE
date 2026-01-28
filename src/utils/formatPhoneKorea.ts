export function formatPhoneKorea(raw: string | null | undefined) {
  const digits = (raw ?? "").replace(/\D/g, "");

  // 11자리 이상만 처리: 010-1234-5678 (초과는 11자리까지만)
  const d = digits.slice(0, 11);
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}
