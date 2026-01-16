import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header } from "@/components/common";
import { Calendar } from "@/components/photoLab";

interface LocationState {
  labName?: string;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const labName = state?.labName ?? "현상소";

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
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
        </section>
      </main>
    </div>
  );
}
