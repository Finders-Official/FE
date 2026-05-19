const SKELETON_COUNT = 5;

export default function LabPreviewSkeleton() {
  return (
    <div className="flex flex-col gap-0">
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <div
          key={`preview-skeleton-${i}`}
          className="flex items-center gap-3.5 border-b border-neutral-800 py-4"
        >
          {/* 이미지 */}
          <div className="h-[3.75rem] w-[3.75rem] shrink-0 animate-pulse rounded-[0.625rem] bg-neutral-800" />
          {/* 텍스트 */}
          <div className="flex flex-1 flex-col gap-2">
            <div className="h-[1.06rem] w-32 animate-pulse rounded bg-neutral-800" />
            <div className="h-[0.75rem] w-48 animate-pulse rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
