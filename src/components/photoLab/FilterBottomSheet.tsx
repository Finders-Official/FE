import { useState, useMemo, useEffect, useCallback } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import Calendar from "@/components/photoLab/Calendar";
import { calcVisibleRows } from "@/utils/calendar";
import TimeSlotList from "@/components/photoLab/TimeSlotList";
import RegionSelector from "@/components/photoLab/RegionSelector";
import { TIME_SLOTS } from "@/constants/photoLab/timeSlots";
import { REGIONS, MAX_REGION_SELECTIONS } from "@/constants/photoLab/regions";
import { useRegionFilters } from "@/hooks/photoLab";
import type { FilterState, Region, RegionSelection } from "@/types/photoLab";

// 전체 시트 높이 (Handle + Tabs + ContentPad + Calendar + TimeSlot + Buttons + Gaps)
const CONTENT_BASE_HEIGHT_REM = 46; // 캘린더 6줄 기준
const MAX_CALENDAR_ROWS = 6;
const ROW_HEIGHT_REM = 3.125; // 3rem (DateChip) + 0.125rem (gap)

// "오전 9:00" → 9, "오후 2:00" → 14 변환
function parseHour(slot: string): number {
  const [period, hm] = slot.split(" ");
  const h = parseInt(hm, 10);
  if (period === "오전") return h;
  return h === 12 ? 12 : h + 12;
}

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

  // 지역 데이터 API 조회
  const { data: regionData } = useRegionFilters();

  // API 데이터를 Region[] 형태로 변환 (RegionSelector 호환)
  const regions: Region[] = useMemo(() => {
    if (!regionData) return REGIONS; // API 로딩 전 fallback
    return regionData.parents.map((parent) => {
      const children = regionData.regions.filter(
        (r) => r.parentId === parent.parentId,
      );
      return {
        name: parent.parentName,
        count: children.length,
        subRegions: ["전체", ...children.map((c) => c.regionName)],
      };
    });
  }, [regionData]);

  // regionId 매핑: "parentName-childName" → regionId
  const regionIdMap = useMemo(() => {
    if (!regionData) return new Map<string, number>();
    const map = new Map<string, number>();
    for (const child of regionData.regions) {
      const parent = regionData.parents.find(
        (p) => p.parentId === child.parentId,
      );
      if (parent) {
        map.set(`${parent.parentName}-${child.regionName}`, child.regionId);
      }
    }
    return map;
  }, [regionData]);

  // 내부 필터 상태
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (initialFilter?.date) {
      return new Date(initialFilter.date);
    }
    return undefined;
  });
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    initialFilter?.time ?? [],
  );

  // 지역 복수 선택 상태
  const [selectedRegions, setSelectedRegions] = useState<RegionSelection[]>(
    initialFilter?.regionSelections ?? [],
  );
  const defaultDisplayRegion = regionData?.parents[0]?.parentName ?? "서울";
  const [displayedRegion, setDisplayedRegion] = useState<string>(
    initialFilter?.regionSelections?.[0]?.parentName ?? defaultDisplayRegion,
  );

  // 오늘인데 모든 시간 슬롯이 지났으면 선택 불가
  const isDateDisabled = useCallback((date: Date) => {
    const now = new Date();
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
    return isToday && now.getHours() >= 20;
  }, []);

  // 오늘이면 지난 시간 숨김 (선택 상태는 유지, 적용 시 정리)
  const filteredSlots = useMemo(() => {
    if (!selectedDate) return TIME_SLOTS;
    const now = new Date();
    const isToday =
      selectedDate.getFullYear() === now.getFullYear() &&
      selectedDate.getMonth() === now.getMonth() &&
      selectedDate.getDate() === now.getDate();
    if (!isToday) return TIME_SLOTS;
    const currentHour = now.getHours();
    return TIME_SLOTS.filter((slot) => parseHour(slot) > currentHour);
  }, [selectedDate]);

  // 시간 토글 (복수 선택)
  const handleTimeToggle = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  // 지역 서브 리전 토글
  const handleSubRegionToggle = (parentName: string, subRegion: string) => {
    setSelectedRegions((prev) => {
      const exists = prev.some(
        (s) => s.parentName === parentName && s.subRegion === subRegion,
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.parentName === parentName && s.subRegion === subRegion),
        );
      }
      if (prev.length >= MAX_REGION_SELECTIONS) return prev;
      return [...prev, { parentName, subRegion }];
    });
  };

  // 지역 선택 칩 제거
  const handleRemoveSelection = (parentName: string, subRegion: string) => {
    setSelectedRegions((prev) =>
      prev.filter(
        (s) => !(s.parentName === parentName && s.subRegion === subRegion),
      ),
    );
  };

  // RegionSelection[] → regionIds[] 변환
  const selectionsToRegionIds = (selections: RegionSelection[]): number[] => {
    const ids = selections.flatMap((sel) => {
      if (sel.subRegion === "전체") {
        if (!regionData) return [];
        const parent = regionData.parents.find(
          (p) => p.parentName === sel.parentName,
        );
        if (!parent) return [];
        return regionData.regions
          .filter((r) => r.parentId === parent.parentId)
          .map((r) => r.regionId);
      }
      const key = `${sel.parentName}-${sel.subRegion}`;
      const id = regionIdMap.get(key);
      return id ? [id] : [];
    });
    return [...new Set(ids)];
  };

  // 초기화
  const handleReset = () => {
    setSelectedDate(undefined);
    setSelectedTimes([]);
    setSelectedRegions([]);
    setDisplayedRegion(defaultDisplayRegion);
  };

  // 적용
  const handleApply = () => {
    const filter: FilterState = {};

    if (selectedDate) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(selectedDate.getDate()).padStart(2, "0");
      filter.date = `${y}-${m}-${d}`;
    }
    // 현재 보이는 슬롯에 포함된 시간만 적용
    const validTimes = selectedTimes.filter((t) => filteredSlots.includes(t));
    if (validTimes.length > 0) {
      filter.time = validTimes;
    }
    if (selectedRegions.length > 0) {
      filter.regionSelections = selectedRegions;
      filter.regionIds = selectionsToRegionIds(selectedRegions);
    }

    onApply(filter);
    onClose();
  };

  // 캘린더 viewDate (controlled)
  const [viewDate, setViewDate] = useState(() => {
    if (initialFilter?.date) return new Date(initialFilter.date);
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // 캘린더 줄 수 (viewDate에서 파생)
  const calendarRows = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return calcVisibleRows(viewDate, today);
  }, [viewDate]);

  // 화면 높이 상태
  const [vh, setVh] = useState(() => window.innerHeight);

  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 화면 높이 기반으로 expandedVh 계산
  const expandedVh = useMemo(() => {
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const rowDiff = MAX_CALENDAR_ROWS - calendarRows;
    const contentHeightRem = CONTENT_BASE_HEIGHT_REM - rowDiff * ROW_HEIGHT_REM;
    const contentHeightPx = contentHeightRem * rootFontSize;
    const calculated = Math.min(92, (contentHeightPx / vh) * 100);
    return Math.max(70, calculated);
  }, [vh, calendarRows]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      expandedVh={expandedVh}
      collapsedRatio={expandedVh / 100}
      initialSnap="expanded"
      overlay={true}
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
                viewDate={viewDate}
                onViewDateChange={setViewDate}
                isDateDisabled={isDateDisabled}
              />
              <TimeSlotList
                slots={filteredSlots}
                selectedTimes={selectedTimes}
                onTimeToggle={handleTimeToggle}
              />
            </div>
          ) : (
            // 지역별 탭
            <RegionSelector
              regions={regions}
              selectedRegions={selectedRegions}
              displayedRegion={displayedRegion}
              onRegionDisplay={setDisplayedRegion}
              onSubRegionToggle={handleSubRegionToggle}
              onRemoveSelection={handleRemoveSelection}
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
