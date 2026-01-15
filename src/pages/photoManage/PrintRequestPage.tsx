import { useMemo, useState } from "react";
import { CTA_Button } from "@/components/common";
import { photoMock } from "@/types/photo";
import { PhotoQuantityStepper } from "../../components/photoManage/PhotoQuantityStepper";
import { useNavigate } from "react-router";

type QtyMap = Record<number, number>;

export function PrintRequestPage() {
  const navigate = useNavigate();
  const [qtyById, setQtyById] = useState<QtyMap>(() => {
    const init: QtyMap = {};
    for (const p of photoMock) init[p.id] = 0;
    return init;
  });

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
    if (isNextEnabled) navigate("../photoManage/pickup-method");
    else return;
  };

  const isNextEnabled = totalQty > 0;

  return (
    <div className="flex h-dvh flex-col pt-7">
      <header className="leading-[128%] tracking-[-0.025rem] text-neutral-100">
        <p className="mb-3 text-[1.25rem]">이 사진들로 인화할까요?</p>
        <p className="text-[0.9375rem] font-light">
          여러장 인화하고 싶으면 각 컷별 인화 매수를 조절하세요
        </p>
      </header>

      <main className="mt-8 mb-[calc(var(--tabbar-height)+var(--fab-gap))] grid flex-1 grid-cols-2 gap-4 overflow-y-auto">
        {photoMock.map((photo) => {
          const qty = qtyById[photo.id] ?? 0;

          return (
            <div key={photo.id} className="flex flex-col items-center">
              <img
                src={photo.src}
                alt={photo.title}
                className="h-40 w-40 rounded-[0.625rem]"
              />
              <PhotoQuantityStepper
                qty={qty}
                onDec={() => decrease(photo.id)}
                onInc={() => increase(photo.id)}
                min={0}
                // max={99} // 필요하면
              />
            </div>
          );
        })}
      </main>

      <nav className="border-neutral-850 sticky bottom-0 z-50 h-[var(--tabbar-height)] w-full max-w-6xl border-t bg-neutral-900 px-4">
        <div className="flex h-full items-center">
          <CTA_Button
            text="다음"
            size="xlarge"
            color={isNextEnabled ? "orange" : "black"}
            disabled={!isNextEnabled}
            onClick={handleNext}
          />
        </div>
      </nav>
    </div>
  );
}
