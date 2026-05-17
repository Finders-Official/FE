import type { LabPreview } from "@/types/photoLabSearch";

interface LabPreviewItemProps {
  lab: LabPreview;
  onClick?: () => void;
}

export default function LabPreviewItem({ lab, onClick }: LabPreviewItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 py-[1rem] first:pt-0"
    >
      {/* 이미지 */}
      {lab.imageUrl ? (
        <img
          src={lab.imageUrl}
          alt={lab.name}
          className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-[0.375rem] object-cover"
        />
      ) : (
        <div className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-[0.375rem] bg-neutral-800" />
      )}

      {/* 텍스트 */}
      <div className="flex flex-1 flex-col justify-center gap-0.5">
        <span className="truncate text-left text-[1.06rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
          {lab.name}
        </span>
        <span className="truncate text-left text-[0.75rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-300">
          {lab.address}
        </span>
      </div>
    </button>
  );
}
