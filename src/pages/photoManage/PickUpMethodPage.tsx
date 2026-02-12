import { ShoeIcon, TruckIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { BigButton } from "@/components/photoManage/BigButton";
import { useAddressIdStore } from "@/store/useAddressId.store";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import type { ReceiptMethod } from "@/types/photomanage/process";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

type PickUpMethod = "pickup" | "delivery";

const toReceiptMethod = (m: PickUpMethod): ReceiptMethod =>
  m === "pickup" ? "PICKUP" : "DELIVERY";

const fromReceiptMethod = (
  m: ReceiptMethod | null | undefined,
): PickUpMethod | null => {
  if (m === "PICKUP") return "pickup";
  if (m === "DELIVERY") return "delivery";
  return null;
};

export function PickUpMethodPage() {
  const navigate = useNavigate();

  const setSelectedAddressId = useAddressIdStore((s) => s.setSelectedAddressId);

  const receiptMethod = usePrintOrderStore((s) => s.receiptMethod);
  const setReceiptMethod = usePrintOrderStore((s) => s.setReceiptMethod);
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);
  const setSelectedOptions = usePrintOrderStore((s) => s.setSelectedOptions);

  const [selectedMethod, setSelectedMethod] = useState<PickUpMethod | null>(
    fromReceiptMethod(receiptMethod),
  );

  useEffect(() => {
    setSelectedMethod(fromReceiptMethod(receiptMethod));
  }, [receiptMethod]);

  const isNextEnabled = useMemo(
    () => Boolean(selectedMethod),
    [selectedMethod],
  );

  const handlePick = (m: PickUpMethod) => {
    setSelectedMethod(m);
    //선택은 store에 유지
    setReceiptMethod(toReceiptMethod(m));
  };

  const handleNext = () => {
    if (!selectedMethod) return;

    // 다음을 누르면 항상 주소 초기화(새로 입력 유도)
    setDeliveryAddress(null);
    setSelectedAddressId(null);

    if (selectedMethod === "pickup") {
      setSelectedOptions({});
      navigate("/photoManage/print-option");
      return;
    }

    // delivery
    navigate("/photoManage/select-address");
  };

  return (
    <div className="flex h-full flex-col pt-7">
      <header className="leading-[128%] tracking-[-0.025rem] text-neutral-100">
        <p className="mb-3 text-[1.25rem]">수령 방식을 선택해 주세요</p>
        <p className="text-[0.9375rem] font-light">
          직접 수령 또는 배송 중 하나를 선택하세요
        </p>
      </header>

      <main className="mt-8 mb-[calc(var(--tabbar-height)+var(--fab-gap))] flex flex-1 justify-center gap-4">
        <BigButton
          title="직접 수령"
          description="매장 방문 후 직접 수령"
          icon={ShoeIcon}
          isSelected={selectedMethod === "pickup"}
          onClick={() => handlePick("pickup")}
        />
        <BigButton
          title="배송"
          description="배송비 3000원 추가"
          icon={TruckIcon}
          isSelected={selectedMethod === "delivery"}
          onClick={() => handlePick("delivery")}
        />
      </main>

      <nav className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center">
          <CTA_Button
            text="다음"
            size="xlarge"
            color={isNextEnabled ? "orange" : "black"}
            disabled={!isNextEnabled}
            onClick={handleNext}
          />
        </div>
      </nav>
    </div>
  );
}
