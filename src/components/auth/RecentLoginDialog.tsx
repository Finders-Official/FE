import { PolygonIcon } from "@/assets/icon";

export function RecentLoginDialog() {
  return (
    <div className="flex flex-col items-center self-center">
      <div className="bg-neutral-0 rounded-[0.625rem] px-[0.62rem] py-[0.44rem] font-semibold text-orange-500">
        최근에 로그인 했어요
      </div>
      <PolygonIcon className="-mt-0.5 h-3 w-3" />
    </div>
  );
}
