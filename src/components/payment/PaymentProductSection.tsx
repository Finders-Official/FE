import {
  creditCoin1,
  creditCoin2,
  creditCoin3,
  creditCoin4,
  creditCoin5,
} from "@/assets/images";
import type { CreditProduct } from "@/types/credit";
import { PaymentSection } from "./PaymentSection";

interface PaymentProductSectionProps {
  product: CreditProduct;
}

function pickCoinImage(amount: number): string {
  if (amount >= 58) return creditCoin5;
  if (amount >= 46) return creditCoin4;
  if (amount >= 34) return creditCoin3;
  if (amount >= 22) return creditCoin2;
  return creditCoin1;
}

const formatKrw = (price: number) => `₩ ${price.toLocaleString("ko-KR")}`;

export function PaymentProductSection({ product }: PaymentProductSectionProps) {
  return (
    <PaymentSection title="주문 상품">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.4375rem]">
          <img
            src={pickCoinImage(product.creditAmount)}
            alt=""
            className="h-4 w-4 object-cover"
          />
          <p className="text-[0.875rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-200">
            {product.name}
          </p>
        </div>
        <p className="text-[0.875rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-200">
          {formatKrw(product.price)}
        </p>
      </div>
    </PaymentSection>
  );
}
