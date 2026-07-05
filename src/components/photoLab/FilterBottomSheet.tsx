import { useState, useMemo, useEffect } from "react";
import BottomSheet from "@/components/common/BottomSheet";
import RegionSelector from "@/components/photoLab/RegionSelector";
import { REGIONS, MAX_REGION_SELECTIONS } from "@/constants/photoLab/regions";
import { useRegionFilters } from "@/hooks/photoLab";
import type { FilterState, Region, RegionSelection } from "@/types/photoLab";

interface FilterBottomSheetProps {
  open: boolean;
  onClose: () => void;
  initialFilter?: FilterState;
  onApply: (filter: FilterState) => void;
}

export default function FilterBottomSheet({
  open,
  onClose,
  initialFilter,
  onApply,
}: FilterBottomSheetProps) {
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
    if (!regionData) return new Map<string, string>();
    const map = new Map<string, string>();
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

  // 지역 복수 선택 상태
  const [selectedRegions, setSelectedRegions] = useState<RegionSelection[]>(
    initialFilter?.regionSelections ?? [],
  );
  const defaultDisplayRegion = regionData?.parents[0]?.parentName ?? "서울";
  const [displayedRegion, setDisplayedRegion] = useState<string>(
    initialFilter?.regionSelections?.[0]?.parentName ?? defaultDisplayRegion,
  );

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
  const selectionsToRegionIds = (selections: RegionSelection[]): string[] => {
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
      return id != null ? [id] : [];
    });
    return [...new Set(ids)];
  };

  // 초기화
  const handleReset = () => {
    setSelectedRegions([]);
    setDisplayedRegion(defaultDisplayRegion);
  };

  // 적용
  const handleApply = () => {
    const filter: FilterState = {};
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

  // 지역 선택 패널 기준 높이(rem→px)로 expandedVh 계산
  const expandedVh = useMemo(() => {
    const calculated = Math.min(92, (436 / vh) * 100);
    return Math.max(70, calculated);
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
        {/* 컨텐츠 영역 */}
        <div className={"min-h-0 flex-1 overflow-hidden px-4 py-5"}>
          <RegionSelector
            regions={regions}
            selectedRegions={selectedRegions}
            displayedRegion={displayedRegion}
            onRegionDisplay={setDisplayedRegion}
            onSubRegionToggle={handleSubRegionToggle}
            onRemoveSelection={handleRemoveSelection}
          />
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
