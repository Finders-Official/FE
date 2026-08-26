import { PolygonIcon } from "@/assets/icon";

interface RecentLoginDialogProps {
  className?: string;
}

export function RecentLoginDialog({ className = "" }: RecentLoginDialogProps) {
  return (
    <div className={`flex flex-col items-center self-center ${className}`}>
      <div className="rounded-lg bg-neutral-100 px-2 py-1.25 text-xs font-semibold text-orange-500">
        최근에 로그인 했어요
      </div>
      <PolygonIcon className="-mt-0.5 h-2.5 w-2.5" />
    </div>
  );
}
