import { useState, useMemo } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import DateChip from "@/components/common/chips/DateChip";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  minDate?: Date; // 선택 가능한 최소 날짜 (기본: 오늘)
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export default function Calendar({
  selectedDate,
  onDateSelect,
  minDate,
}: CalendarProps) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const effectiveMinDate = minDate ?? today;

  const [viewDate, setViewDate] = useState(() => selectedDate ?? today);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // 이전 달로 이동
  const goToPrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  // 해당 월의 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // 해당 월의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [year, month]);

  // 날짜 비교 (년월일만)
  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // 날짜가 비활성화되어야 하는지
  const isDisabled = (date: Date) => {
    return date < effectiveMinDate;
  };

  // 오늘인지 확인
  const isToday = (date: Date) => {
    return isSameDay(date, today);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 년/월 네비게이션 */}
      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="이전 달"
        >
          <ChevronLeftIcon className="h-3 w-4 text-neutral-700" />
        </button>
        <span className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
          {year}. {String(month + 1).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="flex h-6 w-6 items-center justify-center"
          aria-label="다음 달"
        >
          <ChevronLeftIcon className="h-3 w-4 rotate-180 text-neutral-200" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-x-[0.125rem] px-[0.4375rem]">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="flex h-[1.375rem] items-center justify-center text-[0.875rem] leading-[154%] font-normal tracking-[-0.02em] text-neutral-100"
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-x-[0.125rem] gap-y-[0.125rem]">
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="h-[3rem] w-[3rem]" />;
          }

          const disabled = isDisabled(date);
          const selected = selectedDate ? isSameDay(date, selectedDate) : false;
          const todayLabel = isToday(date) ? "오늘" : undefined;

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
