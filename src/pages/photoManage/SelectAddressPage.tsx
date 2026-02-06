import { PlusIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { AddressCard } from "@/components/photoManage/AddressCard";
import { DaumAddressSearch } from "@/components/photoManage/DaumAddressSearch";
import { useAddressList, useCreateAddress } from "@/hooks/member";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

export function SelectAddressPage() {
  const navigate = useNavigate();
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);

  const { data: addresses = [] } = useAddressList();
  const { mutate: addAddress } = useCreateAddress();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isNextEnabled = useMemo(() => selectedId !== null, [selectedId]);

  const handleAddressFound = (data: { zipcode: string; address: string }) => {
    addAddress(
      {
        addressName: "새 주소",
        zipcode: data.zipcode,
        address: data.address,
        isDefault: addresses.length === 0,
      },
      {
        onSuccess: (res) => {
          setSelectedId(res.data.id);
        },
      },
    );
  };

  const handleComplete = () => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (!selected) return;

    setDeliveryAddress({
      recipientName: "",
      phone: "",
      zipcode: selected.zipcode,
      address: selected.address,
      addressDetail: selected.addressDetail,
    });
    navigate("./detail");
  };

  return (
    <div className="flex h-full flex-col">
      <header className="border-b-[0.8125rem] border-neutral-800 py-4 text-neutral-100">
        <CTA_Button
          text="배송지 신규 등록"
          size="xlarge"
          color="gray"
          icon={PlusIcon}
          onClick={() => setIsSearchOpen(true)}
        />
      </header>

      <main className="mt-8 mb-[calc(var(--tabbar-height)+var(--fab-gap))] flex flex-1 flex-col gap-4">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            isSelected={selectedId === addr.id}
            onClick={() => setSelectedId(addr.id)}
            address={addr}
          />
        ))}
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
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

      <DaumAddressSearch
        open={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onComplete={handleAddressFound}
      />
    </div>
  );
}
