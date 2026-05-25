import { useSearchParams } from "react-router";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import { CreditBalanceCard, CreditProductList } from "@/components/credit";
import {
  MOCK_CREDIT_PRODUCTS,
  MOCK_CURRENT_CREDIT,
} from "@/constants/credit/credit.mock";

const TABS = [{ label: "크레딧 구매" }, { label: "내역" }];

type TabKey = "buy" | "history";

function parseTab(value: string | null): TabKey {
  return value === "history" ? "history" : "buy";
}

export function CreditPage() {
  const [params, setParams] = useSearchParams();
  const tab = parseTab(params.get("tab"));
  const activeIndex = tab === "buy" ? 0 : 1;

  const handleTabChange = (index: number) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", index === 0 ? "buy" : "history");
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="flex flex-col px-4 pt-2 pb-6">
      <CreditBalanceCard balance={MOCK_CURRENT_CREDIT} onInfoClick={() => {}} />
      <UnderlineTabs
        tabs={TABS}
        activeIndex={activeIndex}
        onChange={handleTabChange}
        className="mt-4"
      />
      {tab === "buy" && (
        <CreditProductList
          products={MOCK_CREDIT_PRODUCTS}
          onPurchase={() => {}}
        />
      )}
    </div>
  );
}
