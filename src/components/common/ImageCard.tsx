import { CheckCircleIcon, EmptyCheckCircleIcon } from "@/assets/icon";

type BaseImageCardProps = {
  src: string;
  alt?: string;
  isSelected: boolean;
  onToggle: () => void; // 선택 및 해제
  onOpen: () => void; // 상세 페이지 이동
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
  onOpen,
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
      onClick={(e) => {
        const target = e.target as HTMLElement; // 클릭 위치로 분기
        if (target.closest("[data-toggle-area]")) {
          // 우측 상단 영역 클릭 여부
          onToggle();
          return;
        }
        onOpen(); // 그 외 영역
      }}
      className={`relative aspect-square overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        draggable={false}
      />

      {/* 우측 상단 1/4 토글 영역: 해당 영역 클릭시 사진 선택 및 해제 (그 외 영역은 확대 페이지로 이동) */}
      <div data-toggle-area className="absolute top-0 right-0 h-1/2 w-1/2" />

      {/* 선택된 경우: 테두리(주황) */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 border-4 border-orange-500" />
      )}

      {/* 우측 상단 배지: 선택된 경우, multi면 숫자 / single이면 체크 선택되지 않은 경우, 빈 체크*/}
      {isSelected ? (
        <div className="pointer-events-none absolute top-[0.4375rem] right-[0.4375rem]">
          {mode === "multi" ? (
            <div className="flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full bg-orange-500 text-base font-bold text-white">
              {badgeText}
            </div>
          ) : (
            <CheckCircleIcon className="h-[1.375rem] w-[1.375rem]" />
          )}
        </div>
      ) : (
        <div className="pointer-events-none absolute top-[0.4375rem] right-[0.4375rem]">
          <EmptyCheckCircleIcon className="h-[1.375rem] w-[1.375rem]" />
        </div>
      )}
    </button>
  );
}
