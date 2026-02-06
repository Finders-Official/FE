import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ReceiptMethod } from "@/types/photomanage/process";
import type {
  SelectedPhoto,
  DeliveryAddressRequest,
} from "@/types/photomanage/printOrder";

interface SelectedOptions {
  filmType?: string;
  printMethod?: string;
  paperType?: string;
  size?: string;
  frameType?: string;
}

type PrintOrderState = {
  // 기존 인화 매수
  totalPrintCount: number;
  setTotalPrintCount: (count: number) => void;
  inc: (delta?: number) => void;
  dec: (delta?: number) => void;
  reset: () => void;

  // 워크플로우 상태
  developmentOrderId: number | null;
  selectedPhotos: SelectedPhoto[];
  receiptMethod: ReceiptMethod | null;
  deliveryAddress: DeliveryAddressRequest | null;
  selectedOptions: SelectedOptions;
  printOrderId: number | null;
  totalPrice: number;

  setDevelopmentOrderId: (id: number) => void;
  setSelectedPhotos: (photos: SelectedPhoto[]) => void;
  setReceiptMethod: (method: ReceiptMethod) => void;
  setDeliveryAddress: (address: DeliveryAddressRequest | null) => void;
  setSelectedOptions: (options: SelectedOptions) => void;
  setPrintOrderId: (id: number) => void;
  setTotalPrice: (price: number) => void;
  resetWorkflow: () => void;
};

const clampNonNegativeInt = (n: number) => {
  if (!Number.isFinite(n)) return 0;
  const v = Math.floor(n);
  return v < 0 ? 0 : v;
};

const initialWorkflow = {
  developmentOrderId: null,
  selectedPhotos: [],
  receiptMethod: null,
  deliveryAddress: null,
  selectedOptions: {},
  printOrderId: null,
  totalPrice: 0,
} as const;

export const usePrintOrderStore = create<PrintOrderState>()(
  persist(
    (set, get) => ({
      totalPrintCount: 0,

      setTotalPrintCount: (count) =>
        set({ totalPrintCount: clampNonNegativeInt(count) }),

      inc: (delta = 1) =>
        set({
          totalPrintCount: clampNonNegativeInt(get().totalPrintCount + delta),
        }),

      dec: (delta = 1) =>
        set({
          totalPrintCount: clampNonNegativeInt(get().totalPrintCount - delta),
        }),

      reset: () => set({ totalPrintCount: 0 }),

      // 워크플로우
      ...initialWorkflow,

      setDevelopmentOrderId: (id) => set({ developmentOrderId: id }),
      setSelectedPhotos: (photos) => set({ selectedPhotos: photos }),
      setReceiptMethod: (method) => set({ receiptMethod: method }),
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      setSelectedOptions: (options) => set({ selectedOptions: options }),
      setPrintOrderId: (id) => set({ printOrderId: id }),
      setTotalPrice: (price) => set({ totalPrice: price }),
      resetWorkflow: () => set({ ...initialWorkflow, totalPrintCount: 0 }),
    }),
    {
      name: "print-order",
      version: 2,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
