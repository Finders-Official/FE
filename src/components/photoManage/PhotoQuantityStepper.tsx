import { EmptyCheckCircleIcon, MinusIcon, PlusIcon } from "@/assets/icon";

type Props = {
  qty: number;
  onInc: () => void;
  onDec: () => void;
  min?: number; // 기본 0
  max?: number;
  className?: string;
};

export function PhotoQuantityStepper({
  qty,
  onInc,
  onDec,
  min = 0,
  max,
  className,
}: Props) {
  const canDec = qty > min;
  const canInc = max === undefined ? true : qty < max;

  return (
    <section
      className={`mt-3 flex items-center justify-center gap-6 ${className ?? ""}`}
    >
      <button
        type="button"
        onClick={onDec}
        disabled={!canDec}
        className="relative grid h-5 w-5 place-items-center disabled:opacity-40"
        aria-label="수량 감소"
      >
        <EmptyCheckCircleIcon className="absolute inset-0 h-5 w-5 fill-neutral-900" />
        <MinusIcon className="fill-neutral-750 relative h-2 w-2" />
      </button>

      <p className="min-w-4 text-center text-neutral-100">{qty}</p>

      <button
        type="button"
        onClick={onInc}
        disabled={!canInc}
        className="relative grid h-5 w-5 place-items-center disabled:opacity-40"
        aria-label="수량 증가"
      >
        <EmptyCheckCircleIcon className="absolute inset-0 h-5 w-5 fill-neutral-900" />
        <PlusIcon className="relative h-2 w-2 fill-neutral-100" />
      </button>
    </section>
  );
}
