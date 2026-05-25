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
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-3">
        <img
          src={coinImage}
          alt=""
          draggable={false}
          className="h-[1.75rem] w-[1.75rem] shrink-0 object-contain"
        />
        <span className="text-[1rem] font-medium text-neutral-100">
          {product.name}
        </span>
      </div>
      <PriceButton price={product.price} onClick={onPurchase} />
    </div>
  );
}
