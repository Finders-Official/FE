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

export function formatEstimatedTime(isoDate: string | null): string {
  if (!isoDate) return "현재 확인 중";
  const date = new Date(isoDate);
  const hour = date.getHours();
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${hour >= 12 ? "오후" : "오전"} ${
    hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  }시`;
}

export function formatShippedDate(isoDate: string | null): string {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}(${days[date.getDay()]})`;
}

// 20206.02.07 같이 날짜만 변환하는 유틸 함수
export function formatYmdDot(dateStr: string): string {
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}.${m[2]}.${m[3]}`;

  //fallback
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";

  const y = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}.${mm}.${dd}`;
}
