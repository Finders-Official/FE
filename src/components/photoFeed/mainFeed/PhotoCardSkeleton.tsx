type Props = {
  className?: string;
};

export default function PhotoCardSkeleton({ className = "" }: Props) {
  return (
    <div className="[break-inside:avoid]">
      <div className="block w-full animate-pulse">
        {/* 이미지 영역 */}
        <div
          className={`aspect-[3/4] w-full rounded-2xl bg-neutral-700 ${className}`}
        />

        {/* 텍스트 영역 */}
        <div className="mt-1 mb-2 w-full">
          <div className="h-4 w-full rounded-2xl bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}
