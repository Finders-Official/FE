import TimeFilterChip from "@/components/common/chips/TimeFilterChip";

interface TimeSlotListProps {
  slots: string[];
  selectedTimes: string[];
  onTimeToggle: (time: string) => void;
}

export default function TimeSlotList({
  slots,
  selectedTimes,
  onTimeToggle,
}: TimeSlotListProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 제목 */}
      <h3 className="text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
        시간을 선택해주세요.
      </h3>

      {/* 시간 칩 목록 (수평 스크롤) */}
      <div className="scrollbar-hide -mr-4 flex gap-[0.625rem] overflow-x-auto pr-4">
        {slots.map((time) => (
          <TimeFilterChip
            key={time}
            time={time}
            selected={selectedTimes.includes(time)}
            onClick={() => onTimeToggle(time)}
          />
        ))}
      </div>
    </div>
  );
}

export type { TimeSlotListProps };
