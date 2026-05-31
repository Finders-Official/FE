import type { CreditHistoryItem } from "@/types/credit";

interface CreditHistoryRowProps {
  item: CreditHistoryItem;
}

const formatSignedAmount = (amount: number) =>
  `${amount > 0 ? "+" : ""}${amount}개`;

export function CreditHistoryRow({ item }: CreditHistoryRowProps) {
  const isAddition = item.amount > 0;

  return (
    <li className="flex w-full flex-col gap-px">
      <div className="flex items-center justify-between text-[0.9375rem] leading-[1.55] font-semibold tracking-[-0.02em]">
        <span className="text-neutral-0">{item.title}</span>
        <span className={isAddition ? "text-orange-500" : "text-neutral-100"}>
          {formatSignedAmount(item.amount)}
        </span>
      </div>
      <div className="flex items-center justify-between text-[0.75rem] leading-[1.26] font-normal tracking-[-0.02em] text-neutral-500">
        <span>{item.date}</span>
        <span>잔여 {item.balanceAfter}개</span>
      </div>
    </li>
  );
}
