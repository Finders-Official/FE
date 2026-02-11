import type React from "react";
import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export function AddressDetailPage() {
  const navigate = useNavigate();

  const deliveryAddress = usePrintOrderStore((s) => s.deliveryAddress);
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);
  const setSelectedOptions = usePrintOrderStore((s) => s.setSelectedOptions);

  //store 값으로 초기화
  const [recipientName, setRecipientName] = useState(
    deliveryAddress?.recipientName ?? "",
  );
  const [phone, setPhone] = useState(deliveryAddress?.phone ?? "");

  //뒤로 갔다가 다시 들어왔을 때(또는 주소 선택 페이지에서 address가 갱신됐을 때)
  //로컬 state가 store를 따라가게 동기화
  useEffect(() => {
    const id = window.setTimeout(() => {
      setRecipientName(deliveryAddress?.recipientName ?? "");
      setPhone(deliveryAddress?.phone ?? "");
    }, 0);

    return () => window.clearTimeout(id);
  }, [deliveryAddress?.recipientName, deliveryAddress?.phone]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);

    if (!deliveryAddress) return;
    setDeliveryAddress({
      ...deliveryAddress,
      phone: digits,
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setRecipientName(next);

    if (!deliveryAddress) return;
    setDeliveryAddress({
      ...deliveryAddress,
      recipientName: next.trimStart(), //앞 공백만 제거
    });
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

    setSelectedOptions({});

    navigate("/photoManage/print-option");
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-10 py-10">
        <section className="flex gap-[1.25rem]">
          <InputForm
            name="주소"
            placeholder="주소를 입력해주세요"
            size="medium"
            value={recipientName}
            onChange={handleNameChange}
          />
          <ActionButton type="button" text="주소 찾기" disabled />
        </section>
        <InputForm
          name="상세주소"
          placeholder="상세주소를 입력해주세요"
          size="large"
          value={phone}
          onChange={handlePhoneChange}
        />
        <InputForm
          name="배송지명"
          placeholder="배송지명을 입력해주세요 (예: 우리집, 회사)"
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
