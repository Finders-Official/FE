import { useState, useMemo, useEffect } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import Calendar from "./Calendar";
import TimeSlotList from "./TimeSlotList";
import RegionSelector from "./RegionSelector";
import { TIME_SLOTS } from "@/constants/photoLab/timeSlots";
import { REGIONS } from "@/constants/photoLab/regions";
import type { FilterState } from "@/types/photoLab";

// 컨텐츠에 필요한 최소 높이
const CONTENT_MIN_HEIGHT_REM = 48;

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  initialFilter?: FilterState;
  onApply: (filter: FilterState) => void;
}

const TABS = [{ label: "날짜" }, { label: "지역별" }];

export default function FilterBottomSheet({
  open,
  onClose,
  initialFilter,
  onApply,
}: FilterBottomSheetProps) {
  const [activeTab, setActiveTab] = useState(0);

  // 내부 필터 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialFilter?.date) {
      return new Date(initialFilter.date);
    }
    return undefined;
  });
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    initialFilter?.time,
  );
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(
    initialFilter?.region,
  );
  const [selectedSubRegion, setSelectedSubRegion] = useState<
    string | undefined
  >(initialFilter?.subRegion);
  // 표시할 지역 (선택과 별개로 하위 지역 목록 표시용, 처음 열었을때 뭐라도 보여주기)
  const [displayedRegion, setDisplayedRegion] = useState<string>(
    initialFilter?.region ?? "서울",
  );

  // 초기화
  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSelectedRegion(undefined);
    setSelectedSubRegion(undefined);
    setDisplayedRegion("서울");
  };

  // 적용
  const handleApply = () => {
    const filter: FilterState = {};

    if (selectedDate) {
      filter.date = selectedDate.toISOString().split("T")[0];
    }
    if (selectedTime) {
      filter.time = selectedTime;
    }
    if (selectedRegion) {
      filter.region = selectedRegion;
    }
    if (selectedSubRegion) {
      filter.subRegion = selectedSubRegion;
    }

    onApply(filter);
    onClose();
  };

  // 지역 선택 시 기초 자치단체 초기화, 추후 해보고 변경?
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    setDisplayedRegion(region);
    setSelectedSubRegion(undefined);
  };

  // 화면 높이 상태
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 화면 높이 기반으로 expandedVh 계산, bottomsheet 너무 작거나 크게 열리는거 방지
  const expandedVh = useMemo(() => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const contentHeightPx = CONTENT_MIN_HEIGHT_REM * rootFontSize;
    // 컨텐츠 최소 높이를 vh 퍼센트로 변환, 최대 92%
    const calculated = Math.min(92, (contentHeightPx / vh) * 100);
    // 최소 75%
    return Math.max(75, calculated);
  }, [vh]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      expandedVh={expandedVh}
      collapsedRatio={expandedVh / 100}
      initialSnap="expanded"
    >
      <div className="flex h-full flex-col">
        {/* 탭 */}
        <UnderlineTabs
          tabs={TABS}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        {/* 컨텐츠 영역 */}
        <div
          className={`min-h-0 flex-1 px-4 py-5 ${
            activeTab === 0 ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {activeTab === 0 ? (
            // 날짜 탭
            <div className="flex flex-col gap-5">
              {/* 날짜 선택 제목 */}
              <h3 className="text-neutral-0 text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em]">
                날짜를 선택해주세요.
              </h3>
              <Calendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
              <TimeSlotList
                slots={TIME_SLOTS}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />
            </div>
          ) : (
            // 지역별 탭
            <RegionSelector
              regions={REGIONS}
              selectedRegion={selectedRegion}
              selectedSubRegion={selectedSubRegion}
              displayedRegion={displayedRegion}
              onRegionSelect={handleRegionSelect}
              onSubRegionSelect={setSelectedSubRegion}
            />
          )}
        </div>

        {/* 하단 버튼 영역 */}
        <div className="bg-neutral-875 flex gap-3 border-t border-neutral-800 px-4 py-5">
          {/* 초기화 버튼 */}
          <button
            type="button"
            onClick={handleReset}
            className="flex h-14 w-[7.5625rem] items-center justify-center rounded-[1.125rem] border border-neutral-600 text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200"
          >
            초기화
          </button>

          {/* 적용 버튼 */}
          <button
            type="button"
            onClick={handleApply}
            className="flex h-14 flex-1 items-center justify-center rounded-[1.125rem] bg-orange-500 text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100"
          >
            적용
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}

export type { FilterBottomSheetProps };
