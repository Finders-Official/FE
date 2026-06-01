export interface PaymentTermsGroup {
  heading: string;
  items: string[];
  note?: string;
}

export interface PaymentTermsSection {
  id: "privacy" | "epayment";
  title: string;
  groups: PaymentTermsGroup[];
}
