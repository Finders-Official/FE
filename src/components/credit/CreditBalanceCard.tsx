import { QuestionCircleIcon } from "@/assets/icon";

interface CreditBalanceCardProps {
  balance: number;
  expiringCount: number;
  onInfoClick: () => void;
}

export function CreditBalanceCard({
  balance,
  expiringCount,
  onInfoClick,
}: CreditBalanceCardProps) {
  return (
    <section className="bg-neutral-875 flex flex-col gap-[0.375rem] rounded-[1.25rem] p-6">
      <div className="flex items-center justify-between">
        <p className="text-[0.9375rem] leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100">
          내 크레딧
        </p>
        <button
          type="button"
          onClick={onInfoClick}
          className="flex items-center gap-[0.1875rem]"
          aria-label="크레딧 도움말 보기"
        >
          <span className="text-[0.75rem] leading-[1.26] font-normal tracking-[-0.02em] text-neutral-700">
            크레딧
          </span>
          <QuestionCircleIcon className="h-[1.125rem] w-[1.125rem] text-neutral-700" />
        </button>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-neutral-0 text-[1.5rem] leading-[1.28] font-semibold tracking-[-0.02em]">
          {balance}개
        </p>
        <p className="text-[0.75rem] leading-[1.26] font-normal tracking-[-0.02em] text-neutral-700">
          이번 달 소멸 예정({expiringCount}개)
        </p>
      </div>
    </section>
  );
}
