export default function SearchItemSkeleton() {
  return (
    <div className="flex items-center justify-between">
      {/* 아이콘 + 텍스트 */}
      <div className="flex items-center gap-2">
        {/* 아이콘 원 */}
        <div className="h-7 w-7 rounded-full bg-neutral-800" />

        {/* 텍스트 스켈레톤 */}
        <div className="h-[1rem] w-[9.5rem] rounded-md bg-neutral-800" />
      </div>
    </div>
  );
}
