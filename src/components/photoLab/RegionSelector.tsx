import LocationChip from "@/components/common/chips/LocationChip";
import type { Region } from "@/types/photoLab";

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion?: string;
  selectedSubRegion?: string;
  displayedRegion: string; // 하위 지역 목록을 보여줄 광역 지역
  onRegionSelect: (region: string) => void;
  onSubRegionSelect: (subRegion: string) => void;
}

export default function RegionSelector({
  regions,
  selectedRegion,
  selectedSubRegion,
  displayedRegion,
  onRegionSelect,
  onSubRegionSelect,
}: RegionSelectorProps) {
  // 표시할 광역의 기초 자치단체 목록
  const currentRegion = regions.find((r) => r.name === displayedRegion);
  const subRegions = currentRegion?.subRegions ?? [];

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
              selected={selectedRegion === region.name}
              onClick={() => onRegionSelect(region.name)}
            />
          ))}
        </div>

        {/* 오른쪽: 기초 자치단체 */}
        <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto">
          {subRegions.map((subRegion, index) => {
            const isSelected = selectedSubRegion === subRegion;
            const isNextSelected = selectedSubRegion === subRegions[index + 1];
            const isLastItem = index === subRegions.length - 1;
            const hideBorder = isSelected || isNextSelected || isLastItem;

            return (
              <button
                key={subRegion}
                type="button"
                onClick={() => onSubRegionSelect(subRegion)}
                className={`flex items-center border-b px-4 py-2 text-left ${
                  isSelected
                    ? "bg-neutral-850 rounded-[0.625rem] border-transparent"
                    : hideBorder
                      ? "border-transparent"
                      : "border-neutral-800"
                }`}
              >
                <span
                  className={`text-[0.8125rem] leading-[155%] font-semibold tracking-[-0.02em] ${
                    isSelected ? "text-orange-500" : "text-neutral-100"
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
    </div>
  );
}

export type { RegionSelectorProps };
