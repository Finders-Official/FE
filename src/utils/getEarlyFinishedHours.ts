export function getEarlyFinishedHours(
  estimatedAt: string | null,
  completedAt: string | null,
): number {
  if (!estimatedAt || !completedAt) return -1;
  const estimated = new Date(estimatedAt).getTime();
  const completed = new Date(completedAt).getTime();

  const diffMs = estimated - completed;

  // 일찍 끝나지 않았으면 0
  if (diffMs <= 0) return 0;

  // ms → 시간
  return Math.floor(diffMs / (1000 * 60 * 60));
}
