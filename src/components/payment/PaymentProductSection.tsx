import type { CreditProduct } from "@/types/credit";
import { getCreditCoinImage } from "@/utils/getCreditCoinImage";
import { PaymentSection } from "./PaymentSection";

interface PaymentProductSectionProps {
  product: CreditProduct;
}

const formatKrw = (price: number) => `₩ ${price.toLocaleString("ko-KR")}`;

export function PaymentProductSection({ product }: PaymentProductSectionProps) {
  return (
    <PaymentSection title="주문 상품">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.4375rem]">
          <img
            src={getCreditCoinImage(product.creditAmount)}
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
