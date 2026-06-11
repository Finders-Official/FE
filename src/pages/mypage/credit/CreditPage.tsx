import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import UnderlineTabs from "@/components/common/UnderlineTabs";
import {
  CreditBalanceCard,
  CreditHistoryList,
  CreditInfoDialog,
  CreditProductList,
} from "@/components/credit";
import { useCreditHistories, useCreditPurchasePage } from "@/hooks/credit";
import { useMe } from "@/hooks/member";
import {
  useReconcileApplePurchases,
  useReconcileGooglePurchases,
} from "@/hooks/payment";
import { usePaymentOrderStore } from "@/store/usePaymentOrder.store";
import type { CreditProduct } from "@/types/credit";
import { getPaymentProvider } from "@/utils/platform";

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

  // 진입 시 검증 누락된 구매 복구 (플랫폼별 훅 내부에서 분기)
  useReconcileGooglePurchases();
  useReconcileApplePurchases();

  const { data: me } = useMe();
  const balance = me?.roleData.user?.creditBalance ?? 0;

  const provider = getPaymentProvider();
  const { data: purchasePage, isLoading: isProductsLoading } =
    useCreditPurchasePage({ provider, enabled: tab === "buy" });
  const { data: histories, isLoading: isHistoriesLoading } = useCreditHistories(
    { enabled: tab === "history" },
  );

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
        balance={balance}
        // TODO: BE에 '이번 달 소멸 예정' 필드 추가되면 실제 값으로 교체
        expiringCount={0}
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
            products={purchasePage?.products ?? []}
            onPurchase={handlePurchase}
          />
        )}
        {tab === "history" && <CreditHistoryList items={histories ?? []} />}
      </div>
      <LoadingSpinner open={isProductsLoading || isHistoriesLoading} />
    </div>
  );
}
