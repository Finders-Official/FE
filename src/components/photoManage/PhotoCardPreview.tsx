import { DeleteIcon } from "@/assets/icon";

type ImageCardProps = {
  src: string;
  alt?: string;
  showClose: boolean;
  onClose?: () => void;
  className?: string;
};

export function PhotoCardPreview({
  src,
  alt = "",
  showClose,
  onClose,
  className = "",
}: ImageCardProps) {
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div className="aspect-square w-[53px] overflow-hidden rounded-2xl">
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* 우측 상단 X */}
      {showClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="선택 해제"
          className="absolute top-[-0.375rem] right-[-0.375rem] flex"
        >
          <DeleteIcon className="h-[1.375rem] w-[1.375rem]" />
        </button>
      )}
    </div>
  );
}
