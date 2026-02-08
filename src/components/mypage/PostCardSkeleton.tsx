export function PostCardSkeleton() {
  return (
    <div>
      <div className="animate-pulse">
        {/* 이미지 */}
        <div className="h-[14.25rem] rounded-md bg-neutral-700" />

        {/* 제목 */}
        <div className="mt-2 h-4 rounded-md bg-neutral-800" />

        {/* 날짜 + 좋아요 */}
        <div className="mt-2 flex items-center gap-1">
          <div className="h-3 w-20 rounded-md bg-neutral-800" />

          <div className="ml-auto flex items-center gap-1">
            <div className="h-4 w-4 rounded bg-neutral-800" />
            <div className="h-3 w-6 rounded-md bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  );
}
