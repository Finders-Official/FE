export default function ProfileSkeleton() {
  return (
    <div className="flex animate-pulse items-start gap-2">
      {/* avatar */}
      <div className="h-9 w-9 rounded-full bg-neutral-700" />

      {/* text */}
      <div className="flex flex-1 flex-col gap-2 pt-0.5">
        <div className="h-[13px] w-[42px] rounded bg-neutral-700" />
        <div className="h-[11px] w-[78px] rounded bg-neutral-700 opacity-70" />
      </div>
    </div>
  );
}
