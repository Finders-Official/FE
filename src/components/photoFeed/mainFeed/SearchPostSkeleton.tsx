export default function SearchPostSkeleton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`t-skel-sheen flex items-center justify-between ${className}`}
    >
      {/* 이미지 + 텍스트 영역 */}
      <div className="flex items-center gap-[18px]">
        {/* 이미지 스켈레톤 */}
        <div className="h-21 w-21 rounded-2xl bg-neutral-800" />

        {/* 텍스트 스켈레톤 */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-[140px] rounded bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
