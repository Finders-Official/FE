import LocationChip from "@/components/common/chips/LocationChip";
import type { Region } from "@/types/photoLab";

interface RegionSelectorProps {
  regions: Region[];
  selectedRegion?: string;
  selectedSubRegion?: string;
  onRegionSelect: (region: string) => void;
  onSubRegionSelect: (subRegion: string) => void;
}

export default function RegionSelector({
  regions,
  selectedRegion,
  selectedSubRegion,
  onRegionSelect,
  onSubRegionSelect,
}: RegionSelectorProps) {
  // 선택된 광역의 기초 자치단체 목록
  const currentRegion = regions.find((r) => r.name === selectedRegion);
  const subRegions = currentRegion?.subRegions ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* 제목 */}
      <h3 className="text-neutral-0 text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em]">
        지역을 선택해주세요.
      </h3>

      {/* 2열 레이아웃 */}
      <div className="flex gap-[3.75rem]">
        {/* 왼쪽: 광역 자치단체 */}
        <div className="flex w-[4.9375rem] flex-col gap-[0.625rem] overflow-y-auto">
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
        <div className="flex flex-1 flex-col overflow-y-auto">
          {subRegions.map((subRegion, index) => {
            const isFirst = index === 0;
            const isSelected = selectedSubRegion === subRegion;

            return (
              <button
                key={subRegion}
                type="button"
                onClick={() => onSubRegionSelect(subRegion)}
                className={`flex items-center px-4 py-2 text-left ${
                  isFirst
                    ? "bg-neutral-850 rounded-[0.625rem]"
                    : "border-b border-neutral-800"
                }`}
              >
                <span
                  className={`text-[0.8125rem] leading-[155%] font-semibold tracking-[-0.02em] ${
                    isSelected ? "text-orange-500" : "text-neutral-100"
                  }`}
                >
                  {subRegion}
                </span>
                {isFirst && currentRegion && (
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
