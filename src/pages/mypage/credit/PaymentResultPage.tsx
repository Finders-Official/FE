import { useEffect, useRef, type ReactNode } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router";
import { ConfirmationIcon } from "@/components/common";
import Header from "@/components/common/Header";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PAYMENT_ALREADY_PROCESSED_CODE } from "@/constants/payment/payment.constant";
import {
  extractPortoneErrorCode,
  mapPortoneDetailToOutcome,
  useCompletePortonePayment,
} from "@/hooks/payment";
import {
  clearPendingPortonePayment,
  loadPendingPortonePayment,
} from "@/lib/payment/pendingPortonePayment";
import { isPortoneUserCanceled } from "@/lib/payment/portone";
import type {
  PaymentResult,
  PaymentResultSuccess,
  PortonePaymentDetail,
  PortonePaymentMethod,
} from "@/types/payment";
import { getCreditCoinImage } from "@/utils/getCreditCoinImage";

const formatKrw = (price: number) => `₩ ${price.toLocaleString("ko-KR")}`;

// 결제수단 라벨 폴백
const PORTONE_METHOD_LABELS: Partial<Record<PortonePaymentMethod, string>> = {
  CARD: "카드 결제",
  EASY_PAY: "간편결제",
  MOBILE: "휴대폰 결제",
};

// 결제창 호출 전에 저장한 스냅샷을 우선 사용하고, 없으면 완료 응답으로 복원
function buildSuccessResult(
  paymentId: string,
  detail: PortonePaymentDetail,
): PaymentResultSuccess {
  const pending = loadPendingPortonePayment(paymentId);
  return {
    status: "success",
    product: pending?.product ?? {
      productId: detail.id,
      name: detail.orderName,
      creditAmount: detail.creditAmount ?? 0,
      price: detail.amount,
    },
    methodLabel:
      pending?.methodLabel ??
      (detail.method ? PORTONE_METHOD_LABELS[detail.method] : undefined) ??
      "온라인 결제",
  };
}

export function PaymentResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const result = location.state as PaymentResult | null;

  // 모바일 리다이렉트 복귀 시 포트원이 붙여주는 쿼리 (성공: paymentId만, 실패: code/message 추가)
  const redirectPaymentId = searchParams.get("paymentId");
  const redirectErrorCode = searchParams.get("code");
  const redirectMessage = searchParams.get("message");

  const complete = useCompletePortonePayment();
  const handledPaymentIdRef = useRef<string | null>(null);

  // 리다이렉트 복귀: complete 처리 후 navigate replace로 쿼리를 지우고 결과 state로 전환
  useEffect(() => {
    if (result || !redirectPaymentId) return;
    // 같은 paymentId 중복 처리 방지
    if (handledPaymentIdRef.current === redirectPaymentId) return;
    handledPaymentIdRef.current = redirectPaymentId;

    const toResult = (state: PaymentResult) =>
      navigate("/mypage/credit/payment/result", { replace: true, state });

    // 결제창 단계에서 실패/취소로 복귀, complete 호출 X
    if (redirectErrorCode) {
      clearPendingPortonePayment();
      if (isPortoneUserCanceled(redirectMessage)) {
        navigate("/mypage/credit", { replace: true });
        return;
      }
      toResult({ status: "fail", errorCode: redirectErrorCode });
      return;
    }

    complete
      .mutateAsync({ paymentId: redirectPaymentId })
      .then((response) => {
        const outcome = mapPortoneDetailToOutcome(response.data);
        if (outcome.status === "success") {
          toResult(buildSuccessResult(redirectPaymentId, response.data));
          return;
        }
        toResult({
          status: "fail",
          errorCode: outcome.status === "fail" ? outcome.errorCode : undefined,
        });
      })
      .catch((error: unknown) => {
        const errorCode = extractPortoneErrorCode(error);
        // 이미 처리된 결제(새로고침 등 중복 호출), 충전 내역에서 확인하도록 이동
        if (errorCode === PAYMENT_ALREADY_PROCESSED_CODE) {
          navigate("/mypage/credit?tab=history", { replace: true });
          return;
        }
        toResult({ status: "fail", errorCode });
      })
      .finally(() => {
        clearPendingPortonePayment();
      });
  }, [
    result,
    redirectPaymentId,
    redirectErrorCode,
    redirectMessage,
    complete,
    navigate,
  ]);

  if (!result) {
    // 리다이렉트 복귀 처리 중, complete 완료 후 결과 state로 전환
    if (redirectPaymentId) {
      return <LoadingSpinner open />;
    }
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
                  src={getCreditCoinImage(result.product.creditAmount)}
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
          onLeftClick={() => navigate("/mypage/inquiry")}
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
