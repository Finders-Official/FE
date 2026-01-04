import { CheckIcon } from "@/assets/icon";

type BaseImageCardProps = {
  src: string;
  alt?: string;
  isSelected: boolean;
  onToggle: () => void;
  className?: string;
};

type SingleModeProps = BaseImageCardProps & {
  mode: "single";
  selectionIndex?: never;
};

type MultiModeProps = BaseImageCardProps & {
  mode: "multi";
  selectionIndex?: number; // multi 모드에서 선택된 순서 표시용
};

type ImageCardProps = SingleModeProps | MultiModeProps;

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
      className={`relative aspect-square overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* 선택된 경우: 테두리(주황) */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 border-4 border-orange-500" />
      )}

      {/* 우측 상단 배지: multi면 숫자 / single이면 체크 */}
      {isSelected && (
        <div className="pointer-events-none absolute top-[0.4375rem] right-[0.4375rem]">
          {mode === "multi" ? (
            <div className="flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white">
              {badgeText}
            </div>
          ) : (
            <CheckIcon className="h-[1.375rem] w-[1.375rem]" />
          )}
        </div>
      )}
    </button>
  );
}
