import { useMemo, useState } from "react";
import { CTA_Button } from "@/components/common";
import { photoMock } from "@/types/photoFeed/postPreview";
import { useNavigate } from "react-router";
import { PhotoQuantityStepper } from "@/components/photoManage/PhotoQuantityStepper";
import { usePrintOrderStore } from "@/store/usePrintOrder.store";

type QtyMap = Record<number, number>;

export function PrintRequestPage() {
  const navigate = useNavigate();

  const [qtyById, setQtyById] = useState<QtyMap>(() => {
    const init: QtyMap = {};
    for (const p of photoMock.previewList) init[p.postId] = 0;
    return init;
  });

  const setTotalPrintCount = usePrintOrderStore((s) => s.setTotalPrintCount);
  const setSelectedPhotos = usePrintOrderStore((s) => s.setSelectedPhotos);

  const totalQty = useMemo(() => {
    return Object.values(qtyById).reduce((sum, v) => sum + v, 0);
  }, [qtyById]);

  const increase = (id: number) => {
    setQtyById((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const decrease = (id: number) => {
    setQtyById((prev) => {
      const next = (prev[id] ?? 0) - 1;
      return { ...prev, [id]: next < 0 ? 0 : next };
    });
  };

  const handleNext = () => {
    setTotalPrintCount(totalQty);

    const photos = Object.entries(qtyById)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => ({ scannedPhotoId: Number(id), quantity: qty }));
    setSelectedPhotos(photos);

    navigate("../photoManage/pickup-method");
  };

  const isNextEnabled = totalQty > 0;

  return (
    <div className="flex h-full flex-col pt-7">
      <header className="leading-[128%] tracking-[-0.025rem] text-neutral-100">
        <p className="mb-3 text-[1.25rem]">이 사진들로 인화할까요?</p>
        <p className="text-[0.9375rem] font-light">
          여러장 인화하고 싶으면 각 컷별 인화 매수를 조절하세요
        </p>
      </header>

      <main className="mt-8 mb-[calc(var(--tabbar-height)+var(--fab-gap))] grid flex-1 grid-cols-2 gap-4 overflow-y-auto">
        {photoMock.previewList.map((photo) => {
          const qty = qtyById[photo.postId] ?? 0;

          return (
            <div key={photo.postId} className="flex flex-col items-center">
              <img
                src={photo.image.imageUrl}
                alt={photo.title}
                className="h-40 w-40 rounded-[0.625rem]"
              />
              <PhotoQuantityStepper
                qty={qty}
                onDec={() => decrease(photo.postId)}
                onInc={() => increase(photo.postId)}
                min={0}
              />
            </div>
          );
        })}
      </main>

      <section className="border-neutral-850 mb-6 flex items-center justify-between border-t px-4 py-5">
        <p className="text-[1.0625rem] font-normal text-neutral-100">
          총 인화 매수
        </p>
        <p className="text-[1.0625rem] font-normal text-orange-500">
          {totalQty}장
        </p>
      </section>

      <footer className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900">
        <div className="flex h-full items-center">
          <CTA_Button
            text="다음"
            size="xlarge"
            color={isNextEnabled ? "orange" : "black"}
            disabled={!isNextEnabled}
            onClick={handleNext}
          />
        </div>
      </footer>
    </div>
  );
}
