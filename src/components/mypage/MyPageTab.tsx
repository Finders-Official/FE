import { Link } from "react-router";
import { tabs } from "@/constants/mypage/mypagetab.constant";

export function MyPageTabs() {
  return (
    <div className="relative h-[6.625rem] w-full overflow-hidden rounded-xl border border-neutral-800 px-6 py-2">
      {/* 가운데 짧은 구분선 2개 */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-neutral-700/70" />
      <div className="pointer-events-none absolute top-1/2 left-2/3 h-10 w-px -translate-x-1/2 -translate-y-1/2 bg-neutral-700/70" />

      <div className="grid h-full w-full grid-cols-3 gap-[2.5rem]">
        {tabs.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex h-full w-full flex-col items-center justify-center gap-2"
            aria-label={label}
          >
            {/* 아이콘 박스 */}
            <Icon className="h-10 w-10" />
            <p className="text-sm leading-none font-light">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
