import { QuestionCircleIcon } from "@/assets/icon";

interface CreditBalanceCardProps {
  balance: number;
  onInfoClick: () => void;
}

export function CreditBalanceCard({
  balance,
  onInfoClick,
}: CreditBalanceCardProps) {
  return (
    <section className="bg-neutral-875 flex items-start justify-between rounded-[1rem] px-5 py-5">
      <div className="flex flex-col gap-1">
        <p className="text-[0.875rem] font-normal text-neutral-300">
          내 크레딧
        </p>
        <p className="text-[1.5rem] leading-tight font-bold text-neutral-100">
          {balance}개
        </p>
      </div>
      <button
        type="button"
        onClick={onInfoClick}
        className="flex items-center gap-1 text-[0.8125rem] text-neutral-500"
        aria-label="크레딧 도움말 보기"
      >
        <span>크레딧</span>
        <QuestionCircleIcon className="h-[1rem] w-[1rem]" />
      </button>
    </section>
  );
}
