export default function LabCardSkeleton() {
  return (
    <div className="flex flex-col py-4">
      <div className="flex flex-col gap-3.5 border-b border-neutral-800 pb-5">
        <div className="flex animate-pulse flex-col gap-2">
          {/* 이름 + 즐겨찾기 */}
          <div className="flex items-center justify-between">
            <div className="h-[1.25rem] w-40 rounded-md bg-neutral-800" />
            <div className="h-6 w-6 rounded-md bg-neutral-800" />
          </div>

          {/* 상세 정보 */}
          <div className="flex flex-col gap-1.5">
            {/* 태그 */}
            <div className="flex items-center gap-1 px-1">
              <div className="h-[1.125rem] w-14 rounded-[0.1875rem] bg-neutral-800" />
              <div className="h-[1.125rem] w-16 rounded-[0.1875rem] bg-neutral-800" />
              <div className="h-[1.125rem] w-12 rounded-[0.1875rem] bg-neutral-800" />
            </div>

            <div className="flex flex-col gap-1">
              {/* 주소 + 거리 */}
              <div className="px-1">
                <div className="h-[0.875rem] w-52 rounded-md bg-neutral-800" />
              </div>

              {/* 작업 건수 + 소요시간 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <div className="h-3 w-3 rounded bg-neutral-800" />
                  </div>
                  <div className="h-[0.875rem] w-20 rounded-md bg-neutral-800" />
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex h-6 w-6 items-center justify-center">
                    <div className="h-3 w-3 rounded bg-neutral-800" />
                  </div>
                  <div className="h-[0.875rem] w-20 rounded-md bg-neutral-800" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 갤러리 */}
        <div className="flex animate-pulse gap-2">
          <div className="h-[8.875rem] w-[14.5rem] shrink-0 rounded-[0.625rem] bg-neutral-700" />
          <div className="h-[8.875rem] w-[14.5rem] shrink-0 rounded-[0.625rem] bg-neutral-700" />
        </div>
      </div>
    </div>
  );
}
