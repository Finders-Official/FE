/** 주어진 월의 캘린더 표시 줄 수를 계산 */
export function calcVisibleCalendarRows(
  viewDate: Date,
  minDate: Date,
  isDateDisabled?: (date: Date) => boolean,
): number {
  const MIN_ROWS = 4;
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const startDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days: { date: Date; isCurrentMonth: boolean }[] = [];

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

  const weeks: (typeof days)[] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const filtered = weeks.filter((week) =>
    week.some(({ date, isCurrentMonth }) => {
      if (!isCurrentMonth) return false;
      if (date < minDate) return false;
      if (isDateDisabled?.(date)) return false;
      return true;
    }),
  );

  return Math.max(MIN_ROWS, filtered.length);
}
