import { useState, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header, Checkbox } from "@/components/common";
import { TimeSlotChip } from "@/components/common/chips";
import { Calendar } from "@/components/photoLab";
import { MinusIcon, PlusIcon } from "@/assets/icon";
import {
  AM_TIME_SLOTS,
  PM_TIME_SLOTS,
  MOCK_DISABLED_TIMES,
  TASK_OPTIONS,
  FILM_ROLL_MIN,
  FILM_ROLL_MAX,
} from "@/constants/photoLab";
import type { TaskType } from "@/types/reservation";

interface LocationState {
  labName?: string;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const labName = state?.labName ?? "현상소";

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
  const [filmRollCount, setFilmRollCount] = useState(0);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null); // 날짜 변경 시 시간 초기화
  }, []);

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const handleTaskToggle = useCallback((task: TaskType) => {
    setSelectedTasks((prev) =>
      prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task],
    );
  }, []);

  const handleFilmRollDecrement = useCallback(() => {
    setFilmRollCount((prev) => Math.max(FILM_ROLL_MIN - 1, prev - 1));
  }, []);

  const handleFilmRollIncrement = useCallback(() => {
    setFilmRollCount((prev) => Math.min(FILM_ROLL_MAX, prev + 1));
  }, []);

  // 날짜가 전체 비활성화인지 확인
  const isDateDisabled = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    return MOCK_DISABLED_TIMES[dateKey] === "ALL";
  }, []);

  // 선택된 날짜의 비활성화 시간 데이터
  const disabledTimesForDate = useMemo(() => {
    if (!selectedDate) return "ALL" as const;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    return MOCK_DISABLED_TIMES[dateKey] ?? [];
  }, [selectedDate]);

  // 시간 비활성화 여부 확인
  const isTimeDisabled = (time: string): boolean => {
    if (disabledTimesForDate === "ALL") return true;
    return disabledTimesForDate.includes(time);
  };

  return (
    <div className="flex w-full flex-col">
      <Header title={labName} showBack onBack={handleBack} />

      <main className="pb-32">
        {/* 날짜 선택 섹션 */}
        <section className="flex flex-col gap-4 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            날짜와 시간을 선택해주세요
          </h2>

          <Calendar
            selectedDate={selectedDate ?? undefined}
            onDateSelect={handleDateSelect}
            isDateDisabled={isDateDisabled}
          />

          {/* 시간 선택 */}
          <div className="border-neutral-850 -mx-4 flex flex-col gap-5 border-t px-4 pt-5">
            {/* 오전 */}
            <div className="flex flex-col gap-2.5">
              <span className="text-base font-normal text-white">오전</span>
              <div className="flex flex-wrap gap-2">
                {AM_TIME_SLOTS.map((time) => (
                  <TimeSlotChip
                    key={time}
                    time={time}
                    selected={selectedTime === time}
                    disabled={isTimeDisabled(time)}
                    onClick={() => handleTimeSelect(time)}
                  />
                ))}
              </div>
            </div>

            {/* 오후 */}
            <div className="flex flex-col gap-2.5">
              <span className="text-base font-normal text-white">오후</span>
              <div className="flex flex-wrap gap-2">
                {PM_TIME_SLOTS.map((time) => (
                  <TimeSlotChip
                    key={`pm-${time}`}
                    time={time}
                    selected={selectedTime === time}
                    disabled={isTimeDisabled(time)}
                    onClick={() => handleTimeSelect(time)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="bg-neutral-850 -mx-4 h-1.5" />

        {/* 작업 옵션 */}
        <section className="flex flex-col gap-5 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            작업 옵션을 선택해주세요
          </h2>

          {/* 작업 종류 */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-base font-normal text-white">
                작업 종류
              </span>
              <span className="text-sm font-normal text-neutral-400">
                필요한 작업을 모두 선택해주세요
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {TASK_OPTIONS.map((option) => (
                <div key={option.type} className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedTasks.includes(option.type)}
                    onChange={() => handleTaskToggle(option.type)}
                  />
                  <span
                    className="cursor-pointer text-base font-normal text-white"
                    onClick={() => handleTaskToggle(option.type)}
                  >
                    {option.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 현상할 필름 롤 수 */}
          <div className="flex flex-col gap-3">
            <span className="text-base font-normal text-white">
              현상할 필름 롤 수
            </span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleFilmRollDecrement}
                disabled={filmRollCount <= 0}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-600 disabled:opacity-40"
                aria-label="롤 수 감소"
              >
                <MinusIcon className="h-3 w-3 text-neutral-400" />
              </button>
              <span className="w-6 text-center text-base font-normal text-white">
                {filmRollCount}
              </span>
              <button
                type="button"
                onClick={handleFilmRollIncrement}
                disabled={filmRollCount >= FILM_ROLL_MAX}
                className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-600 disabled:opacity-40"
                aria-label="롤 수 증가"
              >
                <PlusIcon className="h-3 w-3 text-neutral-400" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
