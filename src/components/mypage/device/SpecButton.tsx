import { PlusIcon } from "@/assets/icon";
import React from "react";
import { Press } from "@/components/common";

interface SpecButtonProps {
  label: string; // 선택 전 안내 문구 (예: "카메라 기종 선택")
  selectedName: string; // 선택된 기종 이름 ("Nikon 28Ti" 등)
  Icon: React.ComponentType<{ className?: string }>; // 전달받은 아이콘 컴포넌트
  onClick: () => void; // 바텀시트를 열기 위한 클릭 이벤트
}

export function SpecButton({
  label,
  selectedName,
  Icon,
  onClick,
}: SpecButtonProps) {
  const isSelected = !!selectedName; // 값이 비어있지 않으면 true

  return (
    <Press
      onClick={onClick}
      type="button"
      className="bg-neutral-875 flex aspect-square h-[8.75rem] w-full min-w-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-neutral-800"
    >
      {isSelected ? (
        /* 기종 선택 후 상태 */
        <>
          <Icon className="h-7 w-7 shrink-0 fill-orange-500 text-orange-500" />
          <span className="block w-full truncate px-2 text-center text-sm font-medium tracking-tight text-orange-500">
            {selectedName}
          </span>
        </>
      ) : (
        /* 기종 선택 전 상태 */
        <>
          <span className="text-3xl leading-none font-light text-neutral-300">
            <PlusIcon className="h-4 w-4 font-semibold" />
          </span>
          <span className="text-xs font-normal tracking-tight text-neutral-300">
            {label}
          </span>
        </>
      )}
    </Press>
  );
}
