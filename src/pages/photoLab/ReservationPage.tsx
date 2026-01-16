import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header } from "@/components/common";
import { TimeSlotChip } from "@/components/common/chips";
import { Calendar } from "@/components/photoLab";
import { AM_TIME_SLOTS, PM_TIME_SLOTS } from "@/constants/photoLab";

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

  return (
    <div className="flex w-full flex-col">
      <Header title={labName} showBack onBack={handleBack} />

      <main className="pb-32">
        {/* 날짜 선택 섹션 */}
        <section className="border-neutral-850 flex flex-col gap-4 border-b px-4 py-[1.875rem]">
          <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            날짜와 시간을 선택해주세요
          </h2>

          <Calendar
            selectedDate={selectedDate ?? undefined}
            onDateSelect={handleDateSelect}
          />

          {/* 시간 선택 */}
          <div className="border-neutral-850 flex flex-col gap-5 border-t pt-5">
            {/* 오전 */}
            <div className="flex flex-col gap-2.5">
              <span className="text-base font-normal text-white">오전</span>
              <div className="flex flex-wrap gap-2">
                {AM_TIME_SLOTS.map((time) => (
                  <TimeSlotChip
                    key={time}
                    time={time}
                    selected={selectedTime === time}
                    disabled={!selectedDate}
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
                    disabled={!selectedDate}
                    onClick={() => handleTimeSelect(time)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
