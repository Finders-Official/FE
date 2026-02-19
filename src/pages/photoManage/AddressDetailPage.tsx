import type React from "react";
import { ActionButton, InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { DaumAddressSearch } from "@/components/photoManage/DaumAddressSearch";
import { useCreateAddress } from "@/hooks/member";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

export function AddressDetailPage() {
  const navigate = useNavigate();

  const deliveryAddress = usePrintOrderStore((s) => s.deliveryAddress);
  const setDeliveryAddress = usePrintOrderStore((s) => s.setDeliveryAddress);

  const { mutate: addAddress, isPending } = useCreateAddress();

  //주소 재검색 모달
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  //입력값: 배송지명 / 상세주소
  const [addressName, setAddressName] = useState("");
  const [addressDetail, setAddressDetail] = useState(
    deliveryAddress?.addressDetail ?? "",
  );

  //store(주소선택)에서 온 값이 바뀌면 상세주소는 유지
  useEffect(() => {
    const id = window.setTimeout(() => {
      setAddressDetail(deliveryAddress?.addressDetail ?? "");
    }, 0);

    return () => window.clearTimeout(id);
  }, [deliveryAddress?.addressDetail]);

  const zipcode = deliveryAddress?.zipcode ?? "";
  const address = deliveryAddress?.address ?? "";

  const canSubmit = useMemo(() => {
    const nameOk = addressName.trim().length > 0;
    const detailOk = addressDetail.trim().length > 0;
    const baseOk = zipcode.trim().length > 0 && address.trim().length > 0;
    return nameOk && detailOk && baseOk && !isPending;
  }, [addressName, addressDetail, zipcode, address, isPending]);

  const handleAddressFound = (data: { zipcode: string; address: string }) => {
    //주소 다시 선택하면 store 갱신
    setDeliveryAddress({
      recipientName: "", // store 타입 유지용(지금 플로우에선 안 씀)
      phone: "", // store 타입 유지용(지금 플로우에선 안 씀)
      zipcode: data.zipcode,
      address: data.address,
      addressDetail, // 현재 입력중 상세주소 유지
    });

    setIsSearchOpen(false);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;

    // 기본주소는 zustand에서 가져온 그대로 사용
    addAddress(
      {
        addressName: addressName.trim(),
        zipcode,
        address,
        addressDetail: addressDetail.trim(),
        isDefault: false,
      },
      {
        onSuccess: (res) => {
          const newId = res.data.addressId;

          // SelectAddressPage로 돌아가면서 상세 주소 정보 입력한 주소가 선택되게
          navigate("../select-address", {
            replace: true,
            state: { selectedAddressId: newId },
          });
        },
      },
    );
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex flex-1 flex-col gap-10 py-10">
        <section className="flex gap-[1.25rem]">
          <InputForm
            name="주소"
            placeholder="주소를 선택해주세요"
            size="medium"
            value={address}
            onChange={() => {}}
            disabled={true}
          />
          <ActionButton
            type="button"
            text="주소 찾기"
            disabled={false}
            onClick={() => setIsSearchOpen(true)}
          />
        </section>

        <InputForm
          name="상세주소"
          placeholder="상세주소를 입력해주세요"
          size="large"
          value={addressDetail}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddressDetail(e.target.value)
          }
        />

        <InputForm
          name="배송지명"
          placeholder="배송지명을 입력해주세요 (예: 우리집, 회사)"
          size="large"
          value={addressName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setAddressName(e.target.value)
          }
        />
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center">
          <CTA_Button
            text={isPending ? "저장 중..." : "입력 완료"}
            size="xlarge"
            color={canSubmit ? "orange" : "black"}
            disabled={!canSubmit}
            onClick={handleSubmit}
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
