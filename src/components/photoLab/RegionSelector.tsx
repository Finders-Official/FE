import { memo, useMemo, useState } from "react";
import LocationChip from "@/components/common/chips/LocationChip";
import { XMarkIcon } from "@/assets/icon";
import { MAX_REGION_SELECTIONS } from "@/constants/photoLab/regions";
import type { Region, RegionSelection } from "@/types/photoLab";
import { Press, Collapse } from "@/components/common";
import { useFlipReorder } from "@/transitions";

interface RegionSelectorProps {
  regions: Region[];
  selectedRegions: RegionSelection[];
  displayedRegion: string;
  onRegionDisplay: (region: string) => void;
  onSubRegionToggle: (parentName: string, subRegion: string) => void;
  onRemoveSelection: (parentName: string, subRegion: string) => void;
}

const EMPTY_SUB_REGIONS: string[] = [];

const selectionKey = (s: RegionSelection) => `${s.parentName}-${s.subRegion}`;

// 칩 제거가 selectedRegions를 바꿀 때 좌/우 목록까지 통째로 리렌더되지 않도록
// 섹션을 memo로 분리하고, 파생값은 문자열 키로 내려 무관한 변경을 걸러낸다.
// (칩 FLIP 애니메이션 첫 프레임과 리렌더가 같은 프레임에 겹치는 걸 최소화)

const ParentRegionColumn = memo(function ParentRegionColumn({
  regions,
  displayedRegion,
  selectedParentsKey,
  onRegionDisplay,
}: {
  regions: Region[];
  displayedRegion: string;
  selectedParentsKey: string;
  onRegionDisplay: (region: string) => void;
}) {
  const selectedParents = useMemo(
    () => new Set(selectedParentsKey.split("|")),
    [selectedParentsKey],
  );

  return (
    <div className="scrollbar-hide flex w-[4.9375rem] flex-col gap-[0.625rem] overflow-y-auto">
      {regions.map((region) => (
        <LocationChip
          key={region.name}
          label={region.name}
          count={region.count}
          selected={
            displayedRegion === region.name || selectedParents.has(region.name)
          }
          onClick={() => onRegionDisplay(region.name)}
        />
      ))}
    </div>
  );
});

const SubRegionList = memo(function SubRegionList({
  displayedRegion,
  subRegions,
  regionCount,
  selectedSubKey,
  atMax,
  onSubRegionToggle,
}: {
  displayedRegion: string;
  subRegions: string[];
  regionCount?: number;
  selectedSubKey: string;
  atMax: boolean;
  onSubRegionToggle: (parentName: string, subRegion: string) => void;
}) {
  const selectedSubs = useMemo(
    () => new Set(selectedSubKey.split("|")),
    [selectedSubKey],
  );

  return (
    <div className="scrollbar-hide flex flex-1 flex-col overflow-y-auto">
      {subRegions.map((subRegion, index) => {
        const isSelected = selectedSubs.has(subRegion);
        const isLastItem = index === subRegions.length - 1;

        return (
          <Press
            key={subRegion}
            type="button"
            onClick={() => onSubRegionToggle(displayedRegion, subRegion)}
            disabled={!isSelected && atMax}
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
            {subRegion === "전체" && regionCount !== undefined && (
              <span
                className={`ml-[0.125rem] text-[0.75rem] leading-[126%] font-normal tracking-[-0.02em] ${
                  isSelected ? "text-orange-500" : "text-neutral-100"
                }`}
              >
                ({regionCount})
              </span>
            )}
          </Press>
        );
      })}
    </div>
  );
});

function SelectedChip({
  flipKey,
  label,
  enter,
  onRemove,
}: {
  flipKey: string;
  label: string;
  enter: boolean;
  onRemove: () => void;
}) {
  // 등장 여부는 마운트 시점에 고정 — 이후 리렌더가 진행 중인 애니메이션을 끊지 않게
  const [animateIn] = useState(enter);

  return (
    <div data-flip-key={flipKey} className="shrink-0">
      <div className={animateIn ? "t-chip-in" : undefined}>
        <Press
          type="button"
          onClick={onRemove}
          className="bg-neutral-850 flex items-center gap-2 rounded-[0.75rem] px-3 py-[0.625rem]"
        >
          <span className="text-[0.8125rem] leading-[155%] font-normal tracking-[-0.02em] whitespace-nowrap text-white">
            {label}
          </span>
          <XMarkIcon className="h-3 w-3 text-neutral-200" />
        </Press>
      </div>
    </div>
  );
}

const SelectedChipsRow = memo(function SelectedChipsRow({
  selectedRegions,
  onRemoveSelection,
}: {
  selectedRegions: RegionSelection[];
  onRemoveSelection: (parentName: string, subRegion: string) => void;
}) {
  // 제거는 즉시 반영하고, 남은 칩의 이동은 FLIP(transform)으로 처리한다
  const orderKey = selectedRegions.map(selectionKey).join("|");
  const flipRef = useFlipReorder<HTMLDivElement>(orderKey, {
    animateRemovals: true,
  });

  // 직전 렌더의 키셋을 기억해 "새로 추가된" 칩에만 등장 애니메이션을 준다
  // (시트를 열 때 기존 칩들이 일괄 팝인하지 않도록)
  const [prevKeys, setPrevKeys] = useState<Set<string> | null>(null);
  const [prevOrderKey, setPrevOrderKey] = useState(orderKey);
  if (prevOrderKey !== orderKey) {
    setPrevOrderKey(orderKey);
    setPrevKeys(new Set(prevOrderKey.split("|")));
  }

  return (
    <Collapse open={selectedRegions.length > 0} className="-mx-4">
      <div className="pt-4">
        <div className="flex flex-col gap-2 border-t-2 border-neutral-800 px-4 pt-4">
          <p className="text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
            <span className="text-orange-500">
              최대 {MAX_REGION_SELECTIONS}개
            </span>
            까지 선택할 수 있어요.
          </p>

          <div
            ref={flipRef}
            className="scrollbar-hide -mr-4 flex gap-[0.625rem] overflow-x-auto pr-4"
          >
            {selectedRegions.map((sel) => {
              const key = selectionKey(sel);
              const chipLabel =
                sel.subRegion === "전체"
                  ? `${sel.parentName} 전체`
                  : sel.subRegion;

              return (
                <SelectedChip
                  key={key}
                  flipKey={key}
                  label={chipLabel}
                  enter={prevKeys !== null && !prevKeys.has(key)}
                  onRemove={() =>
                    onRemoveSelection(sel.parentName, sel.subRegion)
                  }
                />
              );
            })}
          </div>
        </div>
      </div>
    </Collapse>
  );
});

export default function RegionSelector({
  regions,
  selectedRegions,
  displayedRegion,
  onRegionDisplay,
  onSubRegionToggle,
  onRemoveSelection,
}: RegionSelectorProps) {
  const currentRegion = regions.find((r) => r.name === displayedRegion);

  // 선택된 항목이 있는 부모 지역 키 — 내용이 같으면 왼쪽 컬럼 리렌더를 건너뛴다
  const selectedParentsKey = useMemo(
    () =>
      Array.from(new Set(selectedRegions.map((s) => s.parentName)))
        .sort()
        .join("|"),
    [selectedRegions],
  );

  // 현재 표시 중인 부모 지역에서 선택된 서브 리전 키 — 다른 부모의 변경을 걸러낸다
  const selectedSubKey = useMemo(
    () =>
      selectedRegions
        .filter((s) => s.parentName === displayedRegion)
        .map((s) => s.subRegion)
        .sort()
        .join("|"),
    [selectedRegions, displayedRegion],
  );

  return (
    <div className="flex h-full flex-col">
      {/* 제목 */}
      <h3 className="text-neutral-0 text-[1.0625rem] leading-[155%] font-semibold tracking-[-0.02em]">
        지역을 선택해주세요.
      </h3>

      {/* 2열 레이아웃 */}
      <div className="mt-4 flex min-h-0 flex-1 gap-[3.75rem] overflow-hidden">
        <ParentRegionColumn
          regions={regions}
          displayedRegion={displayedRegion}
          selectedParentsKey={selectedParentsKey}
          onRegionDisplay={onRegionDisplay}
        />
        <SubRegionList
          displayedRegion={displayedRegion}
          subRegions={currentRegion?.subRegions ?? EMPTY_SUB_REGIONS}
          regionCount={currentRegion?.count}
          selectedSubKey={selectedSubKey}
          atMax={selectedRegions.length >= MAX_REGION_SELECTIONS}
          onSubRegionToggle={onSubRegionToggle}
        />
      </div>

      {/* 선택된 지역 칩 영역 (칩이 모두 빠지면 섹션도 함께 접힘) */}
      <SelectedChipsRow
        selectedRegions={selectedRegions}
        onRemoveSelection={onRemoveSelection}
      />
    </div>
  );
}

export type { RegionSelectorProps };
