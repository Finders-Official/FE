import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import {
  CreditBalanceCard,
  CreditHistoryList,
  CreditInfoDialog,
  CreditProductList,
} from "@/components/credit";
import {
  MOCK_CREDIT_HISTORIES,
  MOCK_CREDIT_PRODUCTS,
  MOCK_CURRENT_CREDIT,
} from "@/constants/credit/credit.mock";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";
import type { CreditProduct } from "@/types/credit";

const TABS = [{ label: "크레딧 구매" }, { label: "내역" }];

type TabKey = "buy" | "history";

function parseTab(value: string | null): TabKey {
  return value === "history" ? "history" : "buy";
}

export function CreditPage() {
  const [params, setParams] = useSearchParams();
  const tab = parseTab(params.get("tab"));
  const activeIndex = tab === "buy" ? 0 : 1;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const navigate = useNavigate();
  const setProduct = usePaymentOrderStore((s) => s.setProduct);

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

  const handlePurchase = (product: CreditProduct) => {
    setProduct(product);
    navigate("/mypage/credit/payment");
  };

  return (
    <div className="flex flex-col pb-6">
      <CreditBalanceCard
        balance={MOCK_CURRENT_CREDIT}
        onInfoClick={() => setIsInfoOpen(true)}
      />
      <CreditInfoDialog
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
      <div className="-mx-4">
        <UnderlineTabs
          tabs={TABS}
          activeIndex={activeIndex}
          onChange={handleTabChange}
          className="mt-2"
        />
        {tab === "buy" && (
          <CreditProductList
            products={MOCK_CREDIT_PRODUCTS}
            onPurchase={handlePurchase}
          />
        )}
        {tab === "history" && (
          <CreditHistoryList items={MOCK_CREDIT_HISTORIES} />
        )}
      </div>
    </div>
  );
}
