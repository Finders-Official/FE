import { create } from "zustand";
import type { CreditProduct } from "@/types/credit";

type PaymentOrderState = {
  product: CreditProduct | null;
  setProduct: (product: CreditProduct) => void;
  clear: () => void;
};

export const usePaymentOrderStore = create<PaymentOrderState>()((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
  clear: () => set({ product: null }),
}));
