export type CalendarDay = { date: Date; isCurrentMonth: boolean };

const MIN_VISIBLE_ROWS = 4;

/** 해당 월의 42일(6주) 그리드 생성 */
export function buildCalendarGrid(year: number, month: number): CalendarDay[] {
  const startDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: CalendarDay[] = [];

  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ date: new Date(year, month, day), isCurrentMonth: true });
  }
  const remaining = 42 - days.length;
  for (let day = 1; day <= remaining; day++) {
    days.push({
      date: new Date(year, month + 1, day),
      isCurrentMonth: false,
    });
  }

  return days;
}

/** 모두 비활성인 줄을 제거한 표시 날짜 배열 (최소 4줄) */
export function getVisibleDays(
  grid: CalendarDay[],
  minDate: Date,
  isDateDisabled?: (date: Date) => boolean,
): CalendarDay[] {
  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    weeks.push(grid.slice(i, i + 7));
  }

  const hasActiveDate = (week: CalendarDay[]) =>
    week.some(({ date, isCurrentMonth }) => {
      if (!isCurrentMonth) return false;
      if (date < minDate) return false;
      if (isDateDisabled?.(date)) return false;
      return true;
    });

  const filtered = weeks.filter(hasActiveDate);

  if (filtered.length >= MIN_VISIBLE_ROWS) return filtered.flat();
  return weeks.slice(0, Math.max(MIN_VISIBLE_ROWS, filtered.length)).flat();
}

/** 표시 줄 수만 반환 (BottomSheet 높이 계산용) */
export function calcVisibleRows(
  viewDate: Date,
  minDate: Date,
  isDateDisabled?: (date: Date) => boolean,
): number {
  const grid = buildCalendarGrid(viewDate.getFullYear(), viewDate.getMonth());
  return getVisibleDays(grid, minDate, isDateDisabled).length / 7;
}
