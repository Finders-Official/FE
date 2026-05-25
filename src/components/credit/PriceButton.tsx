interface PriceButtonProps {
  price: number;
  onClick: () => void;
}

const formatKrwShort = (price: number) => `₩ ${price.toLocaleString("ko-KR")}`;

export function PriceButton({ price, onClick }: PriceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-neutral-0 flex w-[4.75rem] items-center justify-center rounded-[0.5rem] bg-orange-500 p-[0.625rem] text-[0.75rem] leading-[1.26] font-semibold tracking-[-0.02em] transition-all active:scale-[0.98]"
    >
      {formatKrwShort(price)}
    </button>
  );
}
