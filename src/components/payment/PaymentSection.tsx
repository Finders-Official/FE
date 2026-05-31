import type { ReactNode } from "react";

interface PaymentSectionProps {
  title: string;
  children: ReactNode;
  divider?: boolean;
}

export function PaymentSection({
  title,
  children,
  divider = true,
}: PaymentSectionProps) {
  return (
    <section
      className={`flex flex-col gap-3 px-4 py-5 ${divider ? "border-neutral-875 border-b-4" : ""}`}
    >
      <h2 className="text-neutral-0 text-[1.0625rem] leading-[1.55] font-semibold tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  );
}
