import { create } from "zustand";

type PrintOrderState = {
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string | null) => void;
};

export const useAddressIdStore = create<PrintOrderState>()((set) => ({
  selectedAddressId: null,
  setSelectedAddressId: (id) => set({ selectedAddressId: id }),
}));
