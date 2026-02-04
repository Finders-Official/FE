import { WEEKDAYS } from "@/constants/date";

// 시간을 12시간제로
export function to12Hour(hour: number): {
  period: string;
  displayHour: number;
} {
  const period = hour >= 12 ? "오후" : "오전";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return { period, displayHour };
}

export function formatKoreanDateTime(
  dateStr: string,
  timeStr?: string,
): string {
  const dateTimeStr = timeStr
    ? `${dateStr.replace(/-/g, "/")} ${timeStr}`
    : dateStr.replace(/-/g, "/").replace("T", " ");

  const date = new Date(dateTimeStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  const hour = timeStr ? parseInt(timeStr.split(":")[0], 10) : date.getHours();
  const { period, displayHour } = to12Hour(hour);

  return `${year}. ${month}. ${day}(${weekday}) ${period} ${displayHour}:00`;
}
