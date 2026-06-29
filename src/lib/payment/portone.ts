import * as PortOne from "@portone/browser-sdk/v2";
import type { EasyPayProvider, PaymentMethod } from "@/types/payment";

const STORE_ID = import.meta.env.VITE_PUBLIC_PORTONE_STORE_ID;
const CHANNEL_KEY = import.meta.env.VITE_PUBLIC_PORTONE_CHANNEL_KEY;

// 모바일 환경은 결제창이 리다이렉트 방식으로 동작, 복귀 지점 (쿼리로 paymentId/code)
const REDIRECT_PATH = "/mypage/credit/payment/result";

// FE 결제수단, 포트원 V2 payMethod
const PAY_METHOD_MAP: Record<PaymentMethod, "CARD" | "EASY_PAY" | "MOBILE"> = {
  CARD: "CARD",
  EASY_PAY: "EASY_PAY",
  PHONE: "MOBILE",
};

// FE 간편결제 식별자, 포트원 V2 EasyPayProvider
const EASY_PAY_PROVIDER_MAP: Record<
  EasyPayProvider,
  PortOne.Entity.EasyPayProvider
> = {
  KAKAO_PAY: "KAKAOPAY",
  TOSS: "TOSSPAY",
  NAVER_PAY: "NAVERPAY",
};

// FE 카드 식별자(CREDIT_CARD_OPTIONS.id), 포트원 V2 CardCompany
const CARD_COMPANY_MAP: Record<string, PortOne.Entity.CardCompany> = {
  HYUNDAI: "HYUNDAI_CARD",
  SHINHAN: "SHINHAN_CARD",
  BC: "BC_CARD",
  KB: "KOOKMIN_CARD",
  SAMSUNG: "SAMSUNG_CARD",
  LOTTE: "LOTTE_CARD",
  HANA: "HANA_CARD",
  NH: "NH_CARD",
  WOORI: "WOORI_CARD",
  SUHYUP: "SUHYUP_CARD",
  CITI: "CITI_CARD",
  GWANGJU: "GWANGJU_CARD",
  JEONBUK: "JEONBUK_CARD",
  JEJU: "JEJU_CARD",
  SHINHYUP_CHECK: "SHINHYUP",
  MG_CHECK: "KFCC",
  SAVINGS_CHECK: "SAVINGS_BANK_KOREA",
  POST: "EPOST",
  KDB: "KOREA_DEVELOPMENT_BANK",
  KAKAO_BANK: "KAKAO_BANK",
};

export interface PortoneCheckoutParams {
  paymentId: string;
  orderName: string;
  totalAmount: number;
  method: PaymentMethod;
  cardId: string | null;
  easyPayId: EasyPayProvider | null;
  customer: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  };
}

export type PortoneCheckoutResult =
  | { status: "success" }
  | { status: "canceled" }
  | { status: "fail"; errorCode?: string };

// V2에는 표준 취소 코드가 없어 SDK가 세팅하는 문구로 판별
export function isPortoneUserCanceled(message?: string | null): boolean {
  return message?.includes("사용자가 결제를 취소") ?? false;
}

// 포트원 결제창 호출.
// PC는 인페이지,모바일은 redirectUrl로 이탈
export async function requestPortoneCheckout(
  params: PortoneCheckoutParams,
): Promise<PortoneCheckoutResult> {
  if (!STORE_ID || !CHANNEL_KEY) {
    return { status: "fail", errorCode: "PORTONE_CONFIG_MISSING" };
  }

  const { paymentId, orderName, totalAmount, method, cardId, easyPayId } =
    params;

  const cardCompany = cardId ? CARD_COMPANY_MAP[cardId] : undefined;

  const response = await PortOne.requestPayment({
    storeId: STORE_ID,
    channelKey: CHANNEL_KEY,
    paymentId,
    orderName,
    totalAmount,
    currency: "CURRENCY_KRW",
    payMethod: PAY_METHOD_MAP[method],
    redirectUrl: `${window.location.origin}${REDIRECT_PATH}`,
    customer: {
      fullName: params.customer.fullName,
      phoneNumber: params.customer.phoneNumber,
      ...(params.customer.email ? { email: params.customer.email } : {}),
    },
    // 카드사 다이렉트 호출
    ...(method === "CARD" && cardCompany
      ? { card: { availableCards: [cardCompany] } }
      : {}),
    ...(method === "EASY_PAY" && easyPayId
      ? { easyPay: { easyPayProvider: EASY_PAY_PROVIDER_MAP[easyPayId] } }
      : {}),
    ...(method === "PHONE" ? { productType: "PRODUCT_TYPE_DIGITAL" } : {}),
  });

  if (!response) {
    return { status: "fail", errorCode: "NO_RESPONSE" };
  }

  if (response.code !== undefined) {
    if (isPortoneUserCanceled(response.message)) {
      return { status: "canceled" };
    }
    return { status: "fail", errorCode: response.code };
  }

  return { status: "success" };
}
