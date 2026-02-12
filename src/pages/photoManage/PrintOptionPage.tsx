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
import type { PrintQuoteRequest } from "@/types/photomanage/printOrder";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

const formatWon = (n: number) => `${n.toLocaleString("ko-KR")}원`;
const formatPlusWon = (n: number) => `+ ${n.toLocaleString("ko-KR")}원`;

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

function findOption(
  categories: DropDownCategory[],
  key: CategoryKey,
  value?: string,
): DropDownOption | null {
  if (!value) return null;
  const cat = categories.find((c) => c.key === key);
  if (!cat) return null;
  return cat.options.find((o) => o.value === value) ?? null;
}

export function PrintOptionPage() {
  const navigate = useNavigate();

  const receiptMethod = usePrintOrderStore((s) => s.receiptMethod);
  const totalPrintCount = usePrintOrderStore((s) => s.totalPrintCount);
  const developmentOrderId = usePrintOrderStore((s) => s.developmentOrderId);
  const selectedPhotos = usePrintOrderStore((s) => s.selectedPhotos);
  const deliveryAddress = usePrintOrderStore((s) => s.deliveryAddress);

  const selectedOptions = usePrintOrderStore((s) => s.selectedOptions);
  const setSelectedOptions = usePrintOrderStore((s) => s.setSelectedOptions);

  const totalPrice = usePrintOrderStore((s) => s.totalPrice);
  const setTotalPrice = usePrintOrderStore((s) => s.setTotalPrice);

  const setPrintOrderId = usePrintOrderStore((s) => s.setPrintOrderId);

  const { data: printOptions } = usePrintOptions();
  const { mutate: submitOrder, isPending: isSubmitting } =
    useCreatePrintOrder();

  const quoteRequestId = useRef(0);
  const [isQuoting, setIsQuoting] = useState(false);

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

  //뒤로가기/새로고침 복원: store.selectedOptions(코드) -> DropDownOption
  useEffect(() => {
    if (!categories.length) return;

    const id = window.setTimeout(() => {
      setSelection({
        FILM: findOption(categories, "FILM", selectedOptions.filmType),
        PRINT_METHOD: findOption(
          categories,
          "PRINT_METHOD",
          selectedOptions.printMethod,
        ),
        PAPER: findOption(categories, "PAPER", selectedOptions.paperType),
        SIZE: findOption(categories, "SIZE", selectedOptions.size),
        PRINT_TYPE: findOption(
          categories,
          "PRINT_TYPE",
          selectedOptions.frameType,
        ),
      });
    }, 0);

    return () => window.clearTimeout(id);
  }, [categories, selectedOptions]);

  const handleToggle = (key: CategoryKey) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  const handleSelect = (key: CategoryKey, option: DropDownOption) => {
    setSelection((prev) => ({ ...prev, [key]: option }));
    setOpenKey(null);

    //선택 즉시 persist 저장
    const next = {
      ...selectedOptions,
      ...(key === "FILM" ? { filmType: option.value } : null),
      ...(key === "PRINT_METHOD" ? { printMethod: option.value } : null),
      ...(key === "PAPER" ? { paperType: option.value } : null),
      ...(key === "SIZE" ? { size: option.value } : null),
      ...(key === "PRINT_TYPE" ? { frameType: option.value } : null),
    };
    setSelectedOptions(next);

    //재조회 중 표시에 맞춰 일단 0으로
    setTotalPrice(0);
  };

  // 서버 견적 요청 빌드
  const buildQuoteRequest = useCallback((): PrintQuoteRequest | null => {
    if (
      !developmentOrderId ||
      !receiptMethod ||
      !selection.SIZE ||
      !selection.PRINT_TYPE
    ) {
      return null;
    }

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

  // 옵션 변경/복원 시 서버 가격조회 계속 수행
  useEffect(() => {
    const request = buildQuoteRequest();
    if (!request) return;

    const id = ++quoteRequestId.current;

    const t = window.setTimeout(() => {
      setIsQuoting(true);
    }, 0);

    quotePrintPrice(request)
      .then((res) => {
        if (quoteRequestId.current !== id) return;

        //store에 바로 반영
        setTotalPrice(res.data.totalAmount ?? 0);
      })
      .catch((err) => {
        console.error("견적 조회 실패:", err);
        if (quoteRequestId.current !== id) return;
        setTotalPrice(0);
      })
      .finally(() => {
        if (quoteRequestId.current !== id) return;
        window.setTimeout(() => setIsQuoting(false), 0);
      });

    return () => window.clearTimeout(t);
  }, [buildQuoteRequest, setTotalPrice]);

  const isDelivery = receiptMethod === "DELIVERY";
  const shippingLabel = isDelivery ? "배송" : "직접수령";
  const shippingFee = isDelivery ? DELIVERY_FEE_WON : 0;

  const hasRequired = Boolean(selection.SIZE && selection.PRINT_TYPE);

  //총 금액은 서버 조회 결과(store.totalPrice)
  const displayedTotal = hasRequired ? totalPrice : 0;

  //송금 가능 조건: 필수옵션 선택 + 견적조회 완료 + 금액>0 + 제출중X
  const canPay =
    hasRequired && !isQuoting && displayedTotal > 0 && !isSubmitting;

  const handleSubmit = () => {
    const request = buildQuoteRequest();
    if (!request) return;
    if (!canPay) return;

    submitOrder(request, {
      onSuccess: (res) => {
        setPrintOrderId(res.data);
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
              {isQuoting && hasRequired
                ? "계산 중..."
                : formatWon(displayedTotal)}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-neutral-850 fixed inset-x-0 bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center px-4 py-5">
          <CTA_Button
            text={isQuoting ? "금액 계산 중..." : "송금하기"}
            size="xlarge"
            color={canPay ? "orange" : "black"}
            disabled={!canPay}
            onClick={handleSubmit}
          />
        </div>
      </footer>
    </div>
  );
}
