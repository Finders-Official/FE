interface PriceButtonProps {
  price: number;
  onClick: () => void;
}

const formatKrwShort = (price: number) => `₩${price.toLocaleString("ko-KR")}`;

export function PriceButton({ price, onClick }: PriceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[0.5rem] bg-orange-500 px-3 py-1.5 text-[0.875rem] font-semibold text-neutral-100 transition-all active:scale-[0.98]"
    >
      {formatKrwShort(price)}
    </button>
  );
}
