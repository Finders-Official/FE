export function getEarlyFinishedTime(
  estimatedAt: string | null,
  completedAt: string | null,
): string {
  if (!estimatedAt || !completedAt) return "";

  const estimated = new Date(estimatedAt).getTime();
  const completed = new Date(completedAt).getTime();

  const diffMs = estimated - completed;

  // 일찍 끝나지 않았으면
  if (diffMs <= 0) return "-1";

  const totalMinutes = Math.floor(diffMs / (1000 * 60));

  const minutesInHour = 60;
  const minutesInDay = 60 * 24;

  // 1시간 미만 → 분
  if (totalMinutes < minutesInHour) {
    return `${totalMinutes}분`;
  }

  // 1일 미만 → 시간
  if (totalMinutes < minutesInDay) {
    const hours = Math.floor(totalMinutes / minutesInHour);
    return `${hours}시간`;
  }

  // 1일 이상 → 일
  const days = Math.floor(totalMinutes / minutesInDay);
  return `${days}일`;
}
