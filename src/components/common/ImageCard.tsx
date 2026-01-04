import CheckIcon from "@/assets/icon/check.svg?react";

type SelectMode = "single" | "multi";

type ImageCardProps = {
  src: string;
  alt?: string;

  mode: SelectMode;
  isSelected: boolean;

  selectionIndex?: number; // multi 모드에서 선택된 순서 표시용

  onToggle: () => void;
  className?: string;
};

export function ImageCard({
  src,
  alt = "",
  mode,
  isSelected,
  selectionIndex,
  onToggle,
  className = "",
}: ImageCardProps) {
  // multi 선택일 때 표시할 배지 텍스트 (1부터 보이게)
  const badgeText =
    mode === "multi" && typeof selectionIndex === "number"
      ? String(selectionIndex + 1)
      : null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`relative overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-[122px] w-[122px] object-cover"
        draggable={false}
      />

      {/* 선택된 경우: 테두리(주황) */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 border-4 border-orange-500" />
      )}

      {/* 우측 상단 배지: multi면 숫자 / single이면 체크 */}
      {isSelected && (
        <div className="pointer-events-none absolute top-[7px] right-[7px]">
          {mode === "multi" ? (
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white">
              {badgeText}
            </div>
          ) : (
            <CheckIcon className="h-[22px] w-[22px]" />
          )}
        </div>
      )}
    </button>
  );
}
