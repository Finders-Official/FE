function normalizeIso(iso: string) {
  // 2026-02-05T15:42:37.078924 -> 2026-02-05T15:42:37.078
  return iso.replace(/(\.\d{3})\d+/, "$1");
}

export function timeAgo(iso?: string) {
  if (!iso) return "";

  const normalized = normalizeIso(iso);
  const t = new Date(normalized).getTime();
  if (Number.isNaN(t)) return ""; // 파싱 실패 방어

  const diff = Date.now() - t;

  const min = Math.floor(diff / 60000);
  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;

  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}시간 전`;

  const day = Math.floor(hour / 24);
  if (day < 30) return `${day}일 전`;

  const month = Math.floor(day / 30);
  if (month < 12) return `${month}개월 전`;

  const year = Math.floor(month / 12);
  return `${year}년 전`;
}
