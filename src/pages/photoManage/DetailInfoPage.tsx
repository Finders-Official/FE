import { InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

export function DetailInfoPage() {
  const navigate = useNavigate();
  const deliveryAddress = usePrintOrderStore((s) => s.deliveryAddress);
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);

  const [recipientName, setRecipientName] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);
  };

  const isNextEnabled = useMemo(() => {
    const nameOk = recipientName.trim().length > 0;
    const phoneOk = phone.length >= 10 && phone.length <= 11;
    return nameOk && phoneOk;
  }, [recipientName, phone]);

  const handleComplete = () => {
    if (!deliveryAddress) return;

    setDeliveryAddress({
      ...deliveryAddress,
      recipientName: recipientName.trim(),
      phone,
    });
    navigate("../photoManage/print-option");
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-10 py-10">
        <InputForm
          name="받는 분"
          placeholder="받는 사람의 이름을 입력해 주세요"
          size="large"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
        />
        <InputForm
          name="휴대폰 번호"
          placeholder="받는 사람의 휴대폰 번호를 입력해 주세요"
          size="large"
          value={phone}
          onChange={handlePhoneChange}
        />
      </main>
      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center">
          <CTA_Button
            text="입력 완료"
            size="xlarge"
            color={isNextEnabled ? "orange" : "black"}
            disabled={!isNextEnabled}
            onClick={handleComplete}
          />
        </div>
      </footer>
    </div>
  );
}
