import { useEffect } from "react";
import { XMarkIcon } from "@/assets/icon";
import { CTA_Button, Header } from "@/components/common";
import { PAYMENT_TERMS_SECTIONS } from "@/constants/payment/paymentTerms.constant";
import type { PaymentTermsSection } from "@/types/payment";
import { useReveal } from "@/transitions";

interface PaymentTermsOverlayProps {
  open: boolean;
  initialSectionId: PaymentTermsSection["id"] | null;
  onClose: () => void;
}

export function PaymentTermsOverlay({
  open,
  initialSectionId,
  onClose,
}: PaymentTermsOverlayProps) {
  const { mounted, state, getRevealProps } = useReveal(open, {
    variant: "sheet-bottom",
  });

  // 오버레이가 열린 동안 뒤 페이지 스크롤 잠금 (BottomSheet와 동일 패턴)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 열릴 때 선택한 약관 섹션으로 스크롤
  useEffect(() => {
    if (!open || !initialSectionId) return;
    document
      .getElementById(`term-${initialSectionId}`)
      ?.scrollIntoView({ block: "start" });
  }, [open, initialSectionId]);

  if (!mounted) return null;

  return (
    <div
      className={`ease-smooth-out fixed inset-0 z-[60] flex justify-center bg-black/80 transition-opacity ${
        state === "closing"
          ? "duration-[var(--duration-medium)]"
          : "duration-[var(--duration-slow)]"
      }`}
      style={{ opacity: state === "open" ? 1 : 0 }}
    >
      <div
        {...getRevealProps({
          className:
            "flex h-full w-full max-w-120 flex-col bg-neutral-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
        })}
      >
        <Header
          title="약관 동의"
          className="px-4"
          rightAction={{
            type: "icon",
            icon: <XMarkIcon className="h-4 w-4 text-neutral-200" />,
            onClick: onClose,
          }}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <div className="flex flex-col gap-6 pt-4">
            {PAYMENT_TERMS_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={`term-${section.id}`}
                className="border-neutral-850 flex scroll-mt-4 flex-col gap-5 border-b pb-6"
              >
                <h2 className="text-[1.1875rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100">
                  {section.title}
                </h2>
                <div className="flex flex-col gap-[1.125rem] px-2 text-[0.875rem] leading-[1.55] tracking-[-0.02em] text-neutral-200">
                  {section.groups.map((group) => (
                    <div key={group.heading} className="flex flex-col">
                      <p className="font-semibold">{group.heading}</p>
                      <ul className="list-disc">
                        {group.items.map((item) => (
                          <li key={item} className="ms-[1.3125rem] break-keep">
                            {item}
                          </li>
                        ))}
                      </ul>
                      {group.note && <p className="break-keep">{group.note}</p>}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <footer className="border-neutral-850 shrink-0 border-t bg-neutral-900 px-4 py-5">
          <CTA_Button
            text="다음"
            size="xlarge"
            color="orange"
            onClick={onClose}
          />
        </footer>
      </div>
    </div>
  );
}
