import {
  creditCoin1,
  creditCoin2,
  creditCoin3,
  creditCoin4,
  creditCoin5,
} from "@/assets/images";

export function getCreditCoinImage(amount: number): string {
  if (amount >= 58) return creditCoin5;
  if (amount >= 46) return creditCoin4;
  if (amount >= 34) return creditCoin3;
  if (amount >= 22) return creditCoin2;
  return creditCoin1;
}
