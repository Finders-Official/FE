export default function SimpleLabCardSkeleton() {
  return (
    <div>
      <div className="t-skel-sheen flex gap-4 border-b-[0.5px] border-neutral-800 py-4">
        {/* 썸네일 영역 */}
        <div className="h-15 w-15 rounded-[0.625rem] bg-neutral-800"></div>

        {/* 카드 상세 정보 */}
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="h-[1.43rem] w-[7.375rem] rounded-[0.325rem] bg-neutral-800"></div>
            <div className="h-[1.06rem] w-[10.43rem] rounded-[0.325rem] bg-neutral-800"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
