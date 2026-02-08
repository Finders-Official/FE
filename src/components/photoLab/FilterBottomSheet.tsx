import { useState, useMemo, useEffect } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import Calendar from "./Calendar";
import TimeSlotList from "./TimeSlotList";
import RegionSelector from "./RegionSelector";
import { TIME_SLOTS } from "@/constants/photoLab/timeSlots";
import { REGIONS } from "@/constants/photoLab/regions";
import { useRegionFilters } from "@/hooks/photoLab";
import type { FilterState, Region, RegionSelection } from "@/types/photoLab";

// 컨텐츠에 필요한 최소 높이
const CONTENT_MIN_HEIGHT_REM = 48;
const MAX_REGION_SELECTIONS = 10;

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
    const ids: number[] = [];
    for (const sel of selections) {
      if (sel.subRegion === "전체") {
        // 해당 부모의 모든 자식 regionId 추가
        if (regionData) {
          const parent = regionData.parents.find(
            (p) => p.parentName === sel.parentName,
          );
          if (parent) {
            const childIds = regionData.regions
              .filter((r) => r.parentId === parent.parentId)
              .map((r) => r.regionId);
            ids.push(...childIds);
          }
        }
      } else {
        const key = `${sel.parentName}-${sel.subRegion}`;
        const id = regionIdMap.get(key);
        if (id) ids.push(id);
      }
    }
    // 중복 제거
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
    if (selectedTimes.length > 0) {
      filter.time = selectedTimes;
    }
    if (selectedRegions.length > 0) {
      filter.regionSelections = selectedRegions;
      filter.regionIds = selectionsToRegionIds(selectedRegions);
    }

    onApply(filter);
    onClose();
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
              />
              <TimeSlotList
                slots={TIME_SLOTS}
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
