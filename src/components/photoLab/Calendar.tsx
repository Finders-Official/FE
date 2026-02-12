import { useMemo } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import DateChip from "@/components/common/chips/DateChip";
import { WEEKDAYS } from "@/constants/date";
import { buildCalendarGrid, getVisibleDays } from "@/utils/calendar";
import { isSameDay } from "@/utils/dateFormat";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  viewDate: Date;
  onViewDateChange: (date: Date) => void;
  minDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  viewDate,
  onViewDateChange,
  minDate,
  isDateDisabled,
}: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const effectiveMinDate = minDate ?? today;

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 이전 달로 이동 가능 여부
  const canGoPrev = useMemo(() => {
    const minYear = effectiveMinDate.getFullYear();
    const minMonth = effectiveMinDate.getMonth();
    return year > minYear || (year === minYear && month > minMonth);
  }, [year, month, effectiveMinDate]);

  // 표시할 날짜 (비활성 줄 제거됨)
  const visibleDays = useMemo(() => {
    const grid = buildCalendarGrid(year, month);
    return getVisibleDays(grid, effectiveMinDate, isDateDisabled);
  }, [year, month, effectiveMinDate, isDateDisabled]);

  return (
    <div className="flex flex-col gap-3">
      {/* 년/월 네비게이션 */}
      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={() =>
            canGoPrev && onViewDateChange(new Date(year, month - 1, 1))
          }
          disabled={!canGoPrev}
          className="flex h-6 w-6 items-center justify-center disabled:cursor-not-allowed"
          aria-label="이전 달"
        >
          <ChevronLeftIcon
            className={`h-4.5 w-auto ${canGoPrev ? "text-neutral-200" : "text-neutral-600"}`}
          />
        </button>
        <span className="w-[5rem] text-center text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-nowrap text-neutral-100">
          {year}. {String(month + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => onViewDateChange(new Date(year, month + 1, 1))}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="다음 달"
        >
          <ChevronLeftIcon className="h-4.5 w-auto rotate-180 text-neutral-200" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 justify-items-center gap-x-[0.125rem]">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-[1.375rem] w-[3rem] items-center justify-center text-[0.875rem] leading-[154%] font-normal tracking-[-0.02em] text-neutral-100"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 justify-items-center gap-x-[0.125rem] gap-y-[0.125rem]">
        {visibleDays.map(({ date, isCurrentMonth }, index) => {
          if (!isCurrentMonth) {
            return (
              <div
                key={`other-${index}`}
                className="flex h-[3rem] w-[3rem] items-center justify-center text-[1rem] leading-[155%] font-medium tracking-[-0.02em] text-neutral-600"
              >
                {date.getDate()}
              </div>
            );
          }

          const disabled = date < effectiveMinDate || !!isDateDisabled?.(date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const todayLabel = isSameDay(date, today) ? "오늘" : undefined;

          return (
            <DateChip
              key={date.toISOString()}
              day={date.getDate()}
              label={todayLabel}
              selected={selected}
              disabled={disabled}
              onClick={() => !disabled && onDateSelect(date)}
            />
          );
        })}
      </div>
    </div>
  );
}

export type { CalendarProps };
