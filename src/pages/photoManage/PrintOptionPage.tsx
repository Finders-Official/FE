import { CTA_Button } from "@/components/common";
import { DropBox } from "@/components/photoManage/DropBox";
import {
  DELIVERY_FEE_WON,
  DROPBOX_CATEGORIES,
} from "@/constants/photomanage/category.constant";
import type {
  CategoryKey,
  DropDownOption,
  DropDownSelection,
} from "@/types/photomanage/category";
import { useMemo, useState } from "react";

export function PrintOptionPage() {
  const initialSelection = useMemo<DropDownSelection>(
    () => ({
      FILM: null,
      PRINT_METHOD: null,
      PAPER: null,
      PROCESS: null,
      SIZE: null,
      PRINT_TYPE: null,
      CUTS: null,
    }),
    [],
  );

  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const [selection, setSelection] =
    useState<DropDownSelection>(initialSelection);

  const handleToggle = (key: CategoryKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const handleSelect = (key: CategoryKey, option: DropDownOption) => {
    setSelection((prev) => ({ ...prev, [key]: option }));
    setOpenKey(null); // 선택하면 닫히게(원하면 제거)
  };

  //옵션 합계 = 선택된 옵션들의 priceWon 합산
  const optionsTotalWon = useMemo(() => {
    return (Object.values(selection) as (DropDownOption | null)[])
      .filter((v): v is DropDownOption => v !== null)
      .reduce((sum, opt) => sum + opt.priceWon, 0);
  }, [selection]);

  //총 금액 = 옵션 합계 + 배송비
  const totalWon = useMemo(
    () => optionsTotalWon + DELIVERY_FEE_WON,
    [optionsTotalWon],
  );

  //표시용 포맷
  const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;
  const formatPlusWon = (n: number) => `+ ${n.toLocaleString("ko-KR")}원`;

  return (
    <div className="flex min-h-0 flex-1 flex-col pt-7">
      <header className="leading-[128%] tracking-[-0.025rem]">
        <p className="mb-3 text-[1.25rem]">
          입금 전에 인화 옵션을 확인해 주세요
        </p>
        <p className="text-[0.9375rem] font-light text-neutral-300">
          방문 당시 고른 인화 옵션으로 계산된 금액이에요!
          <br />
          인화 옵션 변경을 원할 경우 수정해주세요.
        </p>
      </header>

      <main className="mt-8 flex min-h-0 flex-1 flex-col overflow-hidden">
        <section className="border-neutral-875 flex flex-col gap-4 overflow-y-auto border-b py-4">
          {DROPBOX_CATEGORIES.map((cat) => (
            <DropBox
              key={cat.key}
              category={cat}
              value={selection[cat.key]}
              isOpen={openKey === cat.key}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}
        </section>

        <section className="shrink-0">
          <div className="border-neutral-875 flex justify-between border-b-[0.5rem] py-5">
            <p>배송</p>
            <p>{formatPlusWon(DELIVERY_FEE_WON)}</p>
          </div>
          <div className="mt-4 mb-4 flex justify-between text-[1.1875rem]">
            <p>총 금액</p>
            <p className="text-orange-500">{formatWon(totalWon)}</p>
          </div>
        </section>
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900 px-4">
        <div className="flex h-full items-center">
          <CTA_Button
            text="송금하기"
            size="xlarge"
            color="orange"
            link="/photoManage/transaction"
          />
        </div>
      </footer>
    </div>
  );
}
