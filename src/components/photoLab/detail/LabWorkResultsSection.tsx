import { ChevronLeftIcon } from "@/assets/icon";

interface LabWorkResultsSectionProps {
  labName: string;
  postImageUrls: string[];
  onMoreClick?: () => void;
  className?: string;
}

export default function LabWorkResultsSection({
  labName,
  postImageUrls,
  onMoreClick,
  className = "",
}: LabWorkResultsSectionProps) {
  if (postImageUrls.length === 0) return null;

  return (
    <div className={`py-[1.875rem] ${className}`}>
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
            작업 결과물
          </h3>
          <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-100">
            {labName}에서 현상한 사진들 ({postImageUrls.length}개)
          </p>
        </div>
        {onMoreClick && (
          <button
            type="button"
            onClick={onMoreClick}
            className="flex h-6 w-6 items-center justify-center"
            aria-label="더보기"
          >
            <ChevronLeftIcon className="h-5 w-5 rotate-180 text-neutral-200" />
          </button>
        )}
      </div>

      {/* 이미지 masonry 스크롤 */}
      <div className="scrollbar-hide scroll-fade-right h-[16rem] overflow-x-auto overflow-y-hidden">
        <div className="flex h-full flex-col flex-wrap content-start gap-3">
          {postImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`작업 결과물 ${index + 1}`}
              loading="lazy"
              className="max-h-full w-auto rounded-[0.625rem] object-contain"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
