import { ShoeIcon, TruckIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { BigButton } from "@/components/photoManage/BigButton";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import type { ReceiptMethod } from "@/types/photomanage/process";
import { useState } from "react";
import { useNavigate } from "react-router";

type PickUpMethod = "pickup" | "delivery";

const toReceiptMethod = (m: PickUpMethod): ReceiptMethod =>
  m === "pickup" ? "PICKUP" : "DELIVERY";

export function PickUpMethodPage() {
  const navigate = useNavigate();
  const setReceiptMethod = usePrintOrderStore((s) => s.setReceiptMethod);
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);
  const [selectedMethod, setSelectedMethod] = useState<PickUpMethod | null>(
    null,
  );

  const isNextEnabled = selectedMethod;

  const handleNext = () => {
    if (!selectedMethod) return;
    setReceiptMethod(toReceiptMethod(selectedMethod));

    if (selectedMethod === "delivery") {
      navigate("../photoManage/select-address");
    } else {
      setDeliveryAddress(null);
      navigate("../photoManage/print-option");
    }
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
          onClick={() => setSelectedMethod("pickup")}
        />
        <BigButton
          title="배송"
          description="배송비 3000원 추가"
          icon={TruckIcon}
          isSelected={selectedMethod === "delivery"}
          onClick={() => setSelectedMethod("delivery")}
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
