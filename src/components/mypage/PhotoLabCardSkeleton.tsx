export function PhotoLabCardSkeleton() {
  return (
    <div className="mt-2 border-b border-neutral-800 py-4">
      <div className="group relative animate-pulse">
        {/* 우상단 즐겨찾기(별) 버튼 자리 */}
        <div className="absolute top-3 right-1 z-10 flex h-10 w-10 items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-neutral-800" />
        </div>

        <div className="block rounded-2xl">
          <div className="flex gap-3">
            {/* 좌측 이미지 */}
            <div className="h-[3.75rem] w-[3.75rem] shrink-0 rounded-md bg-neutral-800" />

            {/* 우측 텍스트 영역 */}
            <section className="flex flex-1 flex-col justify-center p-1">
              {/* 제목 */}
              <div className="h-[1.175rem] w-32 rounded-md bg-neutral-800" />

              {/* 주소 + 거리 */}
              <div className="mt-2 flex items-center gap-2">
                <div className="h-[0.85rem] w-40 rounded-md bg-neutral-800" />
                <div className="h-[0.85rem] w-12 rounded-md bg-neutral-800" />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
