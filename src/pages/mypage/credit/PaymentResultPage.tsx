import type { ReactNode } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import {
  creditCoin1,
  creditCoin2,
  creditCoin3,
  creditCoin4,
  creditCoin5,
} from "@/assets/images";
import { ConfirmationIcon } from "@/components/common";
import Header from "@/components/common/Header";
import type { PaymentResult } from "@/types/payment";

function pickCoinImage(amount: number): string {
  if (amount >= 58) return creditCoin5;
  if (amount >= 46) return creditCoin4;
  if (amount >= 34) return creditCoin3;
  if (amount >= 22) return creditCoin2;
  return creditCoin1;
}

const formatKrw = (price: number) => `₩ ${price.toLocaleString("ko-KR")}`;

export function PaymentResultPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const result = location.state as PaymentResult | null;

  if (!result) {
    return <Navigate to="/mypage/credit" replace />;
  }

  if (result.status === "success") {
    return (
      <ResultLayout
        footer={
          <ResultActions
            leftLabel="충전 내역 확인"
            onLeftClick={() =>
              navigate("/mypage/credit?tab=history", { replace: true })
            }
            rightLabel="AI 사진복원"
            onRightClick={() => navigate("/restore/editor", { replace: true })}
          />
        }
      >
        <div className="flex w-full flex-col items-center gap-12">
          <ResultHero
            title="크레딧 결제가 완료되었어요"
            subtitle="크레딧으로 타거나 망가진 사진을 복원해보세요."
          />

          <section className="bg-neutral-875 flex w-full flex-col gap-2.5 rounded-[0.75rem] p-5">
            <SummaryRow label="상품 정보">
              <div className="flex items-center gap-[0.4375rem]">
                <img
                  src={pickCoinImage(result.product.creditAmount)}
                  alt=""
                  className="h-5 w-5 object-cover"
                />
                <span className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100">
                  {result.product.name}
                </span>
              </div>
            </SummaryRow>
            <SummaryRow label="결제 방법">
              <span className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100">
                {result.methodLabel}
              </span>
            </SummaryRow>
            <SummaryRow label="총 결제금액">
              <span className="text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100">
                {formatKrw(result.product.price)}
              </span>
            </SummaryRow>
          </section>
        </div>
      </ResultLayout>
    );
  }

  return (
    <ResultLayout
      header={
        <Header title="크레딧 충전" showBack onBack={() => navigate(-1)} />
      }
      footer={
        <ResultActions
          leftLabel="문의하기"
          onLeftClick={() => {}}
          rightLabel="재시도"
          onRightClick={() => navigate("/mypage/credit", { replace: true })}
        />
      }
    >
      <ResultHero
        title="크레딧 결제를 실패했습니다"
        subtitle={`실패사유 : (${result.errorCode ?? "오류코드"})`}
      />
    </ResultLayout>
  );
}

interface ResultLayoutProps {
  header?: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

function ResultLayout({ header, footer, children }: ResultLayoutProps) {
  return (
    <div className="-mx-4 flex flex-1 flex-col sm:-mx-6 lg:-mx-8">
      {header && <div className="px-4">{header}</div>}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        {children}
      </main>
      <div className="border-neutral-850 border-t bg-neutral-900 px-4 py-5">
        {footer}
      </div>
    </div>
  );
}

function ResultHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex w-full flex-col items-center gap-[1.375rem]">
      <ConfirmationIcon className="h-12 w-12" />
      <div className="flex w-full flex-col gap-0.5 text-center">
        <h1 className="text-neutral-0 text-[1.25rem] leading-[1.28] font-semibold tracking-[-0.02em] break-keep">
          {title}
        </h1>
        <p className="text-[0.875rem] leading-[1.55] font-normal tracking-[-0.02em] break-keep text-neutral-500">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-[1.5625rem] items-center justify-between">
      <span className="text-[0.875rem] leading-[1.55] font-normal tracking-[-0.02em] text-neutral-300">
        {label}
      </span>
      {children}
    </div>
  );
}

interface ResultActionsProps {
  leftLabel: string;
  onLeftClick: () => void;
  rightLabel: string;
  onRightClick: () => void;
}

function ResultActions({
  leftLabel,
  onLeftClick,
  rightLabel,
  onRightClick,
}: ResultActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onLeftClick}
        className="flex h-14 flex-1 items-center justify-center rounded-[1.125rem] border border-neutral-700 text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-200"
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={onRightClick}
        className="flex h-14 flex-1 items-center justify-center rounded-[1.125rem] bg-orange-500 text-[1rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100"
      >
        {rightLabel}
      </button>
    </div>
  );
}
