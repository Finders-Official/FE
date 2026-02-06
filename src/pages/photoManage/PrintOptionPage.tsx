import { CTA_Button } from "@/components/common";
import { DropBox } from "@/components/photoManage/DropBox";
import { DELIVERY_FEE_WON } from "@/constants/photomanage/category.constant";
import { usePrintOptions, useCreatePrintOrder } from "@/hooks/photoManage";
import { quotePrintPrice } from "@/apis/photoManage";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";
import type {
  CategoryKey,
  DropDownCategory,
  DropDownOption,
  DropDownSelection,
  PrintOptionItem,
} from "@/types/photomanage/category";
import type {
  PrintQuoteRequest,
  PrintQuoteResponse,
} from "@/types/photomanage/printOrder";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const formatPlusWon = (n: number) => `+ ${n.toLocaleString("ko-KR")}원`;

// PrintOptionItem → DropDownOption 변환
function toOption(item: PrintOptionItem, type: CategoryKey): DropDownOption {
  let priceText = "+0원";

  if (type === "FILM") {
    priceText = item.rate ? `+(${item.rate}배)` : "+0원";
  } else if (type === "SIZE") {
    priceText = item.basePrice
      ? `+${item.basePrice.toLocaleString("ko-KR")}원`
      : "+0원";
  } else {
    priceText = item.extraPrice
      ? `+${item.extraPrice.toLocaleString("ko-KR")}원`
      : "+0원";
  }

  return {
    value: item.code,
    label: item.label,
    priceWon: 0,
    priceText,
  };
}

export function PrintOptionPage() {
  const navigate = useNavigate();

  const receiptMethod = usePrintOrderStore((s) => s.receiptMethod);
  const totalPrintCount = usePrintOrderStore((s) => s.totalPrintCount);
  const developmentOrderId = usePrintOrderStore((s) => s.developmentOrderId);
  const selectedPhotos = usePrintOrderStore((s) => s.selectedPhotos);
  const deliveryAddress = usePrintOrderStore((s) => s.deliveryAddress);
  const setSelectedOptions = usePrintOrderStore((s) => s.setSelectedOptions);
  const setPrintOrderId = usePrintOrderStore((s) => s.setPrintOrderId);
  const setTotalPrice = usePrintOrderStore((s) => s.setTotalPrice);

  const { data: printOptions } = usePrintOptions();
  const { mutate: submitOrder, isPending: isSubmitting } =
    useCreatePrintOrder();

  const [quote, setQuote] = useState<PrintQuoteResponse | null>(null);
  const quoteRequestId = useRef(0);

  // API 데이터 → DropDownCategory[] 변환
  const categories = useMemo<DropDownCategory[]>(() => {
    if (!printOptions) return [];
    return [
      {
        key: "FILM" as const,
        title: "필름",
        placeholder: "",
        options: printOptions.filmTypes.map((i) => toOption(i, "FILM")),
      },
      {
        key: "PRINT_METHOD" as const,
        title: "인화 방식",
        placeholder: "",
        options: printOptions.printMethods.map((i) =>
          toOption(i, "PRINT_METHOD"),
        ),
      },
      {
        key: "PAPER" as const,
        title: "인화지",
        placeholder: "",
        options: printOptions.paperTypes.map((i) => toOption(i, "PAPER")),
      },
      {
        key: "SIZE" as const,
        title: "사이즈",
        placeholder: "",
        options: printOptions.sizes.map((i) => toOption(i, "SIZE")),
      },
      {
        key: "PRINT_TYPE" as const,
        title: "인화 유형",
        placeholder: "",
        options: printOptions.frameTypes.map((i) => toOption(i, "PRINT_TYPE")),
      },
    ];
  }, [printOptions]);

  const [openKey, setOpenKey] = useState<CategoryKey | null>(null);
  const [selection, setSelection] = useState<DropDownSelection>({
    FILM: null,
    PRINT_METHOD: null,
    PAPER: null,
    SIZE: null,
    PRINT_TYPE: null,
  });

  const handleToggle = (key: CategoryKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const handleSelect = (key: CategoryKey, option: DropDownOption) => {
    setSelection((prev) => ({ ...prev, [key]: option }));
    setOpenKey(null);
  };

  // 견적 요청 빌드
  const buildQuoteRequest = useCallback((): PrintQuoteRequest | null => {
    if (
      !developmentOrderId ||
      !receiptMethod ||
      !selection.SIZE ||
      !selection.PRINT_TYPE
    )
      return null;

    return {
      developmentOrderId,
      receiptMethod,
      filmType: selection.FILM?.value,
      printMethod: selection.PRINT_METHOD?.value,
      paperType: selection.PAPER?.value,
      size: selection.SIZE.value,
      frameType: selection.PRINT_TYPE?.value,
      photos: selectedPhotos,
      deliveryAddress:
        receiptMethod === "DELIVERY"
          ? (deliveryAddress ?? undefined)
          : undefined,
    };
  }, [
    developmentOrderId,
    receiptMethod,
    selection,
    selectedPhotos,
    deliveryAddress,
  ]);

  // 옵션 변경 시 견적 API 호출 (stale 응답 무시)
  useEffect(() => {
    const request = buildQuoteRequest();
    if (!request) return;

    const id = ++quoteRequestId.current;

    quotePrintPrice(request)
      .then((res) => {
        if (quoteRequestId.current === id) setQuote(res.data);
      })
      .catch((err) => {
        console.error("견적 조회 실패:", err);
      });
  }, [buildQuoteRequest]);

  // 사이즈·인화유형 미선택 시 견적 표시하지 않음
  const displayedQuote = selection.SIZE && selection.PRINT_TYPE ? quote : null;
  const isDelivery = receiptMethod === "DELIVERY";
  const shippingLabel = isDelivery ? "배송" : "직접수령";
  const shippingFee =
    displayedQuote?.deliveryFee ?? (isDelivery ? DELIVERY_FEE_WON : 0);

  const handleSubmit = () => {
    const request = buildQuoteRequest();
    if (!request) return;

    setSelectedOptions({
      filmType: selection.FILM?.value,
      printMethod: selection.PRINT_METHOD?.value,
      paperType: selection.PAPER?.value,
      size: selection.SIZE?.value,
      frameType: selection.PRINT_TYPE?.value,
    });

    submitOrder(request, {
      onSuccess: (res) => {
        setPrintOrderId(res.data);
        setTotalPrice(displayedQuote?.totalAmount ?? 0);
        navigate("/photoManage/transaction");
      },
    });
  };

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
          {categories.map((cat) => (
            <DropBox
              key={cat.key}
              category={cat}
              value={selection[cat.key]}
              isOpen={openKey === cat.key}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}

          <li className="border-neutral-850 flex h-12.75 w-full items-center justify-between gap-2.5 rounded-[0.625rem] border px-4 py-3">
            <p className="text-neutral-300">총 인화 매수</p>
            <p className="text-neutral-300">{totalPrintCount}장</p>
          </li>
        </section>

        <section className="shrink-0">
          <div className="border-neutral-875 flex justify-between border-b-[0.5rem] py-5">
            <p>{shippingLabel}</p>
            <p>{formatPlusWon(shippingFee)}</p>
          </div>

          <div className="mt-4 mb-4 flex justify-between text-[1.1875rem]">
            <p>총 금액</p>
            <p className="text-orange-500">
              {displayedQuote
                ? formatWon(displayedQuote.totalAmount)
                : formatWon(0)}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center">
          <CTA_Button
            text="송금하기"
            size="xlarge"
            color={displayedQuote ? "orange" : "black"}
            disabled={!displayedQuote || isSubmitting}
            onClick={handleSubmit}
          />
        </div>
      </footer>
    </div>
  );
}
