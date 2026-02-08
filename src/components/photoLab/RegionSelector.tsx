import LocationChip from "@/components/common/chips/LocationChip";
import { XMarkIcon } from "@/assets/icon";
import type { Region, RegionSelection } from "@/types/photoLab";

const MAX_SELECTIONS = 10;

interface RegionSelectorProps {
  regions: Region[];
  selectedRegions: RegionSelection[];
  displayedRegion: string;
  onRegionDisplay: (region: string) => void;
  onSubRegionToggle: (parentName: string, subRegion: string) => void;
  onRemoveSelection: (parentName: string, subRegion: string) => void;
}

export default function RegionSelector({
  regions,
  selectedRegions,
  displayedRegion,
  onRegionDisplay,
  onSubRegionToggle,
  onRemoveSelection,
}: RegionSelectorProps) {
  const currentRegion = regions.find((r) => r.name === displayedRegion);
  const subRegions = currentRegion?.subRegions ?? [];

  // 해당 서브 리전이 선택되어 있는지 확인
  const isSubRegionSelected = (subRegion: string) =>
    selectedRegions.some(
      (s) => s.parentName === displayedRegion && s.subRegion === subRegion,
    );

  // 해당 부모 지역에 선택된 항목이 있는지
  const parentHasSelections = (parentName: string) =>
    selectedRegions.some((s) => s.parentName === parentName);

  return (
    <div className="flex h-full flex-col gap-4">
      {/* 제목 */}
      <h3 className="text-neutral-0 text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em]">
        지역을 선택해주세요.
      </h3>

      {/* 2열 레이아웃 */}
      <div className="flex min-h-0 flex-1 gap-[3.75rem]">
        {/* 왼쪽: 광역 자치단체 */}
        <div className="scrollbar-hide flex w-[4.9375rem] flex-col gap-[0.625rem] overflow-y-auto">
          {regions.map((region) => (
            <LocationChip
              key={region.name}
              label={region.name}
              count={region.count}
              selected={
                displayedRegion === region.name ||
                parentHasSelections(region.name)
              }
              onClick={() => onRegionDisplay(region.name)}
            />
          ))}
        </div>

        {/* 오른쪽: 기초 자치단체 */}
        <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto">
          {subRegions.map((subRegion, index) => {
            const isSelected = isSubRegionSelected(subRegion);
            const isLastItem = index === subRegions.length - 1;

            return (
              <button
                key={subRegion}
                type="button"
                onClick={() => onSubRegionToggle(displayedRegion, subRegion)}
                disabled={
                  !isSelected && selectedRegions.length >= MAX_SELECTIONS
                }
                className={`flex items-center px-4 py-2 text-left ${
                  isLastItem ? "border-b-0" : "border-b border-neutral-800"
                } disabled:opacity-40`}
              >
                <span
                  className={`text-[0.8125rem] leading-[155%] tracking-[-0.02em] ${
                    isSelected
                      ? "font-semibold text-orange-500"
                      : "font-normal text-neutral-100"
                  }`}
                >
                  {subRegion}
                </span>
                {subRegion === "전체" && currentRegion && (
                  <span
                    className={`ml-[0.125rem] text-[0.75rem] leading-[126%] font-normal tracking-[-0.02em] ${
                      isSelected ? "text-orange-500" : "text-neutral-100"
                    }`}
                  >
                    ({currentRegion.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 선택된 지역 칩 영역 */}
      {selectedRegions.length > 0 && (
        <div className="flex flex-col gap-2 border-t border-neutral-800 pt-4">
          <p className="text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
            <span className="text-orange-500">최대 {MAX_SELECTIONS}개</span>
            까지 선택할 수 있어요.
          </p>

          <div className="scrollbar-hide -mr-4 flex gap-[0.625rem] overflow-x-auto pr-4">
            {selectedRegions.map((sel) => {
              const chipLabel =
                sel.subRegion === "전체"
                  ? `${sel.parentName} 전체`
                  : sel.subRegion;

              return (
                <button
                  key={`${sel.parentName}-${sel.subRegion}`}
                  type="button"
                  onClick={() =>
                    onRemoveSelection(sel.parentName, sel.subRegion)
                  }
                  className="bg-neutral-850 flex shrink-0 items-center gap-2 rounded-[0.75rem] px-3 py-[0.625rem]"
                >
                  <span className="text-[0.8125rem] leading-[155%] font-normal tracking-[-0.02em] text-white">
                    {chipLabel}
                  </span>
                  <XMarkIcon className="h-4 w-4 text-neutral-400" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export type { RegionSelectorProps };
