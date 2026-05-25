import type { CreditProduct } from "@/types/credit";
import { PriceButton } from "./PriceButton";

interface CreditProductRowProps {
  product: CreditProduct;
  coinImage: string;
  onPurchase: () => void;
}

export function CreditProductRow({
  product,
  coinImage,
  onPurchase,
}: CreditProductRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[0.4375rem]">
        <img
          src={coinImage}
          alt=""
          draggable={false}
          className="h-4 w-4 shrink-0 object-contain"
        />
        <span className="text-neutral-0 text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em]">
          {product.name}
        </span>
      </div>
      <PriceButton price={product.price} onClick={onPurchase} />
    </div>
  );
}
