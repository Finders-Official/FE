import { CTA_Button } from "@/components/common";
import { DropBox } from "@/components/photoManage/DropBox";
import {
  BASE_SIZE_WON,
  DELIVERY_FEE_WON,
  DROPBOX_CATEGORIES,
} from "@/constants/photomanage/category.constant";
import type {
  CategoryKey,
  DropDownOption,
  DropDownSelection,
} from "@/types/photomanage/category";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";

type PickUpMethod = "pickup" | "delivery";

// ✅ 이전 페이지에서 총 인화 매수도 넘겨받는다고 가정
type LocationState = {
  pickupMethod?: PickUpMethod;
  totalPrintCount?: number; // 총 인화 매수(장수)
};

function floorToHundreds(n: number) {
  return Math.floor(n / 100) * 100;
}

function filmRate(value: DropDownOption["value"] | undefined) {
  // value가 네 타입에서 string이라면 그대로 비교 가능
  switch (value) {
    case "COLOR_NEGATIVE":
      return 0.1;
    case "B_W":
      return 0.1;
    case "SLIDE":
    default:
      return 0;
  }
}

export function PrintOptionPage() {
  const location = useLocation();
  const pickupMethod: PickUpMethod =
    (location.state as LocationState | null)?.pickupMethod ?? "delivery";

  const totalPrintCount =
    (location.state as LocationState | null)?.totalPrintCount ?? 10; // ✅ 임시 기본값 10장

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
    setOpenKey(null);
  };

  //배송비: 배송이면 3000, 직접수령이면 0
  const shippingFeeWon = pickupMethod === "delivery" ? DELIVERY_FEE_WON : 0;

  const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;
  const formatPlusWon = (n: number) => `+ ${n.toLocaleString("ko-KR")}원`;

  const shippingLabel = pickupMethod === "delivery" ? "배송" : "직접수령";

  /**
   * ✅ 핵심 계산
   * - SIZE / PAPER / FILM: 장당(per print)
   * - PRINT_METHOD: 고정(flat)
   */
  const price = useMemo(() => {
    const size = selection.SIZE; // size.priceWon = "추가금" (예: 6*8이면 1200)
    const paper = selection.PAPER; // paper.priceWon = 장당 추가금 (예: 50)
    const film = selection.FILM; // film은 배수(rate)
    const printMethod = selection.PRINT_METHOD; // 고정 추가금 (예: 잉크젯 1000)

    // 1) 사이즈 장당 기본금 (사이즈 선택이 없으면 계산 불가 -> 0)
    const sizePerPrint = size ? BASE_SIZE_WON + size.priceWon : 0;

    // 2) 필름 배수 장당 추가금: (사이즈장당 * rate) 후 100원 단위 버림
    const rate = filmRate(film?.value);
    const filmExtraPerPrint = size ? floorToHundreds(sizePerPrint * rate) : 0;

    // 3) 인화지 장당 추가금
    const paperExtraPerPrint = paper ? paper.priceWon : 0;

    // 4) 장당 합계
    const perPrintWon = sizePerPrint + filmExtraPerPrint + paperExtraPerPrint;

    // 5) 장당 합계 * 총 인화 매수
    const printsTotalWon = perPrintWon * totalPrintCount;

    // 6) 인화방식 고정 추가금
    const printMethodFlatWon = printMethod ? printMethod.priceWon : 0;

    // 7) 최종
    const totalWon = printsTotalWon + printMethodFlatWon + shippingFeeWon;

    return {
      sizePerPrint,
      filmExtraPerPrint,
      paperExtraPerPrint,
      perPrintWon,
      printsTotalWon,
      printMethodFlatWon,
      totalWon,
    };
  }, [selection, totalPrintCount, shippingFeeWon]);

  // ✅ SIZE 선택되었을 때 상단 오른쪽 표시는 “기본1400 + 추가금”을 보여주기
  const selectionForView = useMemo(() => {
    const size = selection.SIZE;
    if (!size) return selection;

    const sizeTotal = BASE_SIZE_WON + size.priceWon;

    return {
      ...selection,
      SIZE: {
        ...size,
        priceText: formatPlusWon(sizeTotal), // 예: 6*8이면 +2,600원
      },
    };
  }, [selection]);

  return (
    <div className="flex h-full flex-1 flex-col pt-7">
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
              value={selectionForView[cat.key]}
              isOpen={openKey === cat.key}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}

          {/* ✅ 총 인화 매수(이전 페이지에서 받은 값) */}
          <li className="border-neutral-850 flex h-12.75 w-full items-center justify-between gap-2.5 rounded-[0.625rem] border px-4 py-3">
            <p className="text-neutral-300">총 인화 매수</p>
            <p className="text-neutral-300">{totalPrintCount}장</p>
          </li>
        </section>

        <section className="shrink-0">
          {/* 배송비 */}
          <div className="border-neutral-875 flex justify-between border-b-[0.5rem] py-5">
            <p>{shippingLabel}</p>
            <p>{formatPlusWon(shippingFeeWon)}</p>
          </div>

          {/* 총 금액 */}
          <div className="mt-4 mb-4 flex justify-between text-[1.1875rem]">
            <p>총 금액</p>
            <p className="text-orange-500">{formatWon(price.totalWon)}</p>
          </div>
        </section>
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
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
