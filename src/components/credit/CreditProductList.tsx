import type { CreditProduct } from "@/types/credit";
import { getCreditCoinImage } from "@/utils/getCreditCoinImage";
import { CreditProductRow } from "./CreditProductRow";

interface CreditProductListProps {
  products: CreditProduct[];
  onPurchase: (product: CreditProduct) => void;
}

export function CreditProductList({
  products,
  onPurchase,
}: CreditProductListProps) {
  return (
    <ul className="flex flex-col gap-4 p-4">
      {products.map((product) => (
        <li key={product.productId}>
          <CreditProductRow
            product={product}
            coinImage={getCreditCoinImage(product.creditAmount)}
            onPurchase={() => onPurchase(product)}
          />
        </li>
      ))}
    </ul>
  );
}
