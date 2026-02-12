import { create } from "zustand";

type PrintOrderState = {
  selectedAddressId: number | null;
  setSelectedAddressId: (id: number | null) => void;
};

export const useAddressIdStore = create<PrintOrderState>()((set) => ({
  selectedAddressId: null,
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
}));
