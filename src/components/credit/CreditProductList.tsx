import {
  creditCoin1,
  creditCoin2,
  creditCoin3,
  creditCoin4,
  creditCoin5,
} from "@/assets/images";
import type { CreditProduct } from "@/types/credit";
import { CreditProductRow } from "./CreditProductRow";

const CREDIT_COIN_IMAGES = [
  creditCoin1,
  creditCoin2,
  creditCoin3,
  creditCoin4,
  creditCoin5,
];

interface CreditProductListProps {
  products: CreditProduct[];
  onPurchase: (product: CreditProduct) => void;
}

export function CreditProductList({
  products,
  onPurchase,
}: CreditProductListProps) {
  return (
    <ul className="flex flex-col">
      {products.map((product, index) => (
        <li key={product.productId}>
          <CreditProductRow
            product={product}
            coinImage={CREDIT_COIN_IMAGES[index] ?? CREDIT_COIN_IMAGES[0]}
            onPurchase={() => onPurchase(product)}
          />
        </li>
      ))}
    </ul>
  );
}
