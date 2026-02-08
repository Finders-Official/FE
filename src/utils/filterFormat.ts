import { WEEKDAYS } from "@/constants/date";
import type { FilterState } from "@/types/photoLab";

/**
 * FilterState를 FilterContainer에 표시할 문자열로 변환
 * 예: "1.26(금) • 서울 강남구 외 2개"
 */
export function formatFilterValue(filter: FilterState): string | undefined {
  const parts: string[] = [];

  if (filter.date) {
    const date = new Date(filter.date);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = WEEKDAYS[date.getDay()];
    parts.push(`${month}.${day}(${weekday})`);
  }

  if (filter.regionSelections && filter.regionSelections.length > 0) {
    const first = filter.regionSelections[0];
    const firstLabel =
      first.subRegion === "전체"
        ? `${first.parentName} 전체`
        : `${first.parentName} ${first.subRegion}`;
    if (filter.regionSelections.length === 1) {
      parts.push(firstLabel);
    } else {
      parts.push(`${firstLabel} 외 ${filter.regionSelections.length - 1}개`);
    }
  }

  return parts.length > 0 ? parts.join(" • ") : undefined;
}
