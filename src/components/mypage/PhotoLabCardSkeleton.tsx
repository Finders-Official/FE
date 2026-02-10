export function PhotoLabCardSkeleton() {
  return (
    <div className={`border-neutral-875 mt-2 border-b p-4`}>
      <div className="group relative animate-pulse">
        {/* 제목 */}
        <div className="h-6 w-40 rounded-md bg-neutral-800" />

        {/* 태그 3개 */}
        <section className="mt-3 flex flex-wrap gap-2">
          <div className="h-6 w-14 rounded-md bg-neutral-800" />
          <div className="h-6 w-16 rounded-md bg-neutral-800" />
          <div className="h-6 w-12 rounded-md bg-neutral-800" />
        </section>

        {/* 주소 + 거리 */}
        <div className="mt-2 h-4 w-64 rounded-md bg-neutral-800" />

        {/* 하단 지표 */}
        <section className="mt-3 flex items-center gap-3">
          {/* 작업 건수 */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-neutral-800" />
            <div className="h-4 w-32 rounded-md bg-neutral-800" />
          </div>

          {/* 소요 시간 */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-neutral-800" />
            <div className="h-4 w-28 rounded-md bg-neutral-800" />
          </div>
        </section>

        {/* 우상단 별 아이콘 자리 */}
        <div className="absolute top-1 right-1 h-6 w-6 rounded-md bg-neutral-800" />
      </div>
    </div>
  );
}
