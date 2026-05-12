export default function SimpleLabCardSkeleton() {
  return (
    <div>
      <div className="flex gap-3.5 border-b border-neutral-800 py-4">
        {/* 썸네일 영역 */}
        <div className="h-15 w-15 rounded-[0.625rem] bg-neutral-800"></div>

        {/* 카드 상세 정보 */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-[1.06rem] w-[9.375rem] rounded-[0.325rem] bg-neutral-800"></div>

            {/* 주소 + 거리 */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <div className="h-[0.75rem] w-[9.375rem] rounded-[0.325rem] bg-neutral-800"></div>
                <div className="h-[0.75rem] w-[2.5rem] rounded-[0.325rem] bg-neutral-800"></div>
              </div>
            </div>
          </div>

          <div className="h-4 w-4 rounded-[0.325rem] bg-neutral-800"></div>
        </div>
      </div>
    </div>
  );
}
