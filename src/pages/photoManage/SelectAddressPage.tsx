import { PlusIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { AddressCard } from "@/components/photoManage/AddressCard";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Address = {
  id: number;
  address: string;
  // 필요한 필드가 있으면 추가
};

const mockAddresses: Address[] = [
  { id: 1, address: "동작구 상도동 229-80" },
  { id: 2, address: "동작구 상도동 299-80" },
];

export function SelectAddressPage() {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const isNextEnabled = useMemo(
    () => selectedAddressId !== null,
    [selectedAddressId],
  );

  const handleComplete = () => {
    if (selectedAddressId === null) return;
    // TODO: 선택한 주소 저장(zustand 등)하고 다음으로 이동
    navigate("./detail");
  };

  return (
    <div className="y-scroll-hidden flex h-dvh flex-col">
      <header className="border-b-[0.8125rem] border-neutral-800 py-4 text-neutral-100">
        <CTA_Button
          text="배송지 신규 등록"
          size="xlarge"
          color="gray"
          icon={PlusIcon}
        />
      </header>

      <main className="mt-8 mb-[calc(var(--tabbar-height)+var(--fab-gap))] flex flex-1 flex-col gap-4">
        {mockAddresses.map((addr) => (
          <AddressCard
            key={addr.id}
            isSelected={selectedAddressId === addr.id}
            onClick={() => setSelectedAddressId(addr.id)}
          />
        ))}
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900 px-4">
        <div className="flex h-full items-center">
          <CTA_Button
            text="배송지 선택 완료"
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
