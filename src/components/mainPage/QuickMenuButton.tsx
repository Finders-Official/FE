import { Link } from "react-router";
import { MainCamera, MainFilm, MainSparkle } from "@/assets/icon";

export default function QuickActionGrid() {
  return (
    <section className="mt-[30px] mb-[30px] grid h-[204px] grid-cols-2 grid-rows-2 gap-3 px-5">
      {/* 현상 맡기기 */}
      <ActionCard
        to="/"
        className="row-span-2 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#2a2a2a] to-[#111111]"
      >
        <div className="flex size-[50px] items-center justify-center">
          <MainFilm className="size-full text-orange-500" strokeWidth={1.5} />
        </div>
        <span className="text-[16px] font-semibold text-neutral-100">
          현상 맡기기
        </span>
      </ActionCard>

      {/* 사진 복원하기 */}
      <ActionCard
        to="/"
        className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
      >
        <div className="flex size-[32px] items-center justify-center rounded-full bg-orange-500">
          <MainSparkle className="size-12 fill-white" strokeWidth={0} />
        </div>
        <span className="text-[16px] font-semibold text-neutral-100">
          사진 복원하기
        </span>
      </ActionCard>

      {/* 필카 입문 101 */}
      <ActionCard
        to="/"
        className="flex flex-col items-center justify-center gap-2 bg-[#1C1C1E]"
      >
        <div className="flex size-[32px] items-center justify-center">
          <MainCamera className="size-8 text-[#FF5A00]" strokeWidth={2} />
        </div>
        <span className="mt-[10px]text-[16px] font-semibold text-neutral-100">
          필카 입문 101
        </span>
      </ActionCard>
    </section>
  );
}

interface ActionCardProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

function ActionCard({ to, className, children }: ActionCardProps) {
  return (
    <Link
      to={to}
      className={`relative overflow-hidden rounded-[20px] border border-white/5 shadow-inner transition-transform active:scale-[0.98] ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF5A00]/10 via-transparent to-transparent" />

      {/* 실제 컨텐츠 */}
      <div className="relative z-10 flex size-full flex-col items-center justify-center">
        {children}
      </div>
    </Link>
  );
}
