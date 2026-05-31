import type { CreditHistoryItem } from "@/types/credit";
import { CreditHistoryRow } from "./CreditHistoryRow";

interface CreditHistoryListProps {
  items: CreditHistoryItem[];
}

export function CreditHistoryList({ items }: CreditHistoryListProps) {
  return (
    <ul className="flex flex-col gap-5 px-4 pt-4">
      {items.map((item, index) => (
        <CreditHistoryRow
          key={`${item.date}-${item.title}-${index}`}
          item={item}
        />
      ))}
    </ul>
  );
}
