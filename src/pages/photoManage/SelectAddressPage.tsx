import { PlusIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { AddressCard } from "@/components/photoManage/AddressCard";
import { DaumAddressSearch } from "@/components/photoManage/DaumAddressSearch";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import type { Address } from "@/types/photomanage/address";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";

const STORAGE_KEY = "saved-addresses";

function loadAddresses(): Address[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Address[]) : [];
  } catch {
    return [];
  }
}

function saveAddresses(list: Address[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function SelectAddressPage() {
  const navigate = useNavigate();
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);

  const [addresses, setAddresses] = useState<Address[]>(loadAddresses);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isNextEnabled = useMemo(() => selectedId !== null, [selectedId]);

  const handleAddressFound = useCallback(
    (data: { zipcode: string; address: string }) => {
      const newAddr: Address = {
        id: Date.now(),
        label: "새 주소",
        zipcode: data.zipcode,
        address: data.address,
      };
      const updated = [...addresses, newAddr];
      setAddresses(updated);
      saveAddresses(updated);
      setSelectedId(newAddr.id);
    },
    [addresses],
  );

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
