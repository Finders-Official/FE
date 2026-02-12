import { PlusIcon } from "@/assets/icon";
import { CTA_Button } from "@/components/common";
import { AddressCard } from "@/components/photoManage/AddressCard";
import { DaumAddressSearch } from "@/components/photoManage/DaumAddressSearch";
import { useAddressList } from "@/hooks/member";
import { useAddressIdStore } from "@/store/useAddressId.store";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type LocationState = { selectedAddressId?: number } | null;

export function SelectAddressPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);

  const { data: addresses = [] } = useAddressList();

  const selectedId = useAddressIdStore((s) => s.selectedAddressId);
  const setSelectedId = useAddressIdStore((s) => s.setSelectedAddressId);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isNextEnabled = useMemo(() => selectedId !== null, [selectedId]);

  const handleAddressFound = (data: { zipcode: string; address: string }) => {
    //1) store에 바로 넣고 (상세는 detail에서 입력)
    setDeliveryAddress({
      recipientName: "",
      phone: "",
      zipcode: data.zipcode,
      address: data.address,
      addressDetail: "",
    });

    //2) 상세 입력 페이지로 바로 이동
    navigate("../address-detail");
    //prettier-ignore
  };

  useEffect(() => {
    if (state?.selectedAddressId == null) return;

    setSelectedId(state.selectedAddressId);

    // 뒤로가기/재진입 때 계속 남는 것 방지: state 제거
    navigate(location.pathname, { replace: true, state: null });
  }, [state?.selectedAddressId, navigate, location.pathname]);

  const handleComplete = () => {
    const selected = addresses.find((a) => a.addressId === selectedId);
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
            key={addr.addressId}
            isSelected={selectedId === addr.addressId}
            onClick={() => setSelectedId(addr.addressId)}
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
