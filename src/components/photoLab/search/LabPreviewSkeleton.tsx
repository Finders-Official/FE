const SKELETON_COUNT = 5;

export default function LabPreviewSkeleton() {
  return (
    <div className="flex flex-col gap-3.5">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={`preview-skeleton-${i}`}
          className="flex items-center gap-3.5"
        >
          {/* 이미지 */}
          <div className="h-[2.875rem] w-[2.875rem] shrink-0 animate-pulse rounded-[0.625rem] bg-neutral-800" />
          {/* 텍스트 */}
          <div className="flex flex-1 flex-col gap-1.5">
            <div className="h-[0.875rem] w-32 animate-pulse rounded bg-neutral-800" />
            <div className="h-[0.75rem] w-48 animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
