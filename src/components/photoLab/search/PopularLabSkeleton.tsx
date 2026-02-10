export default function PopularLabSkeleton() {
  return (
    <section className="flex flex-col gap-4">
      {/* 섹션 제목 */}
      <div className="h-[1rem] w-28 rounded-md bg-neutral-800" />

      {/* 인기 현상소 8개 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`popular-skeleton-${i}`}
            className="flex h-6 w-full animate-pulse items-center gap-4"
          >
            <div className="h-[0.875rem] w-3 rounded bg-neutral-800" />
            <div className="h-[0.875rem] w-40 rounded-md bg-neutral-800" />
          </div>
        ))}
      </div>
    </section>
  );
}
