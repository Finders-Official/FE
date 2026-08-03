import BottomSheet from "@/components/common/BottomSheet";
import { Press } from "@/components/common/motion";
import { CREDIT_CARD_OPTIONS } from "@/constants/payment/payment.constant";

interface CardSelectBottomSheetProps {
  open: boolean;
  onClose: () => void;
  selectedCardId: string | null;
  onSelect: (cardId: string) => void;
}

export function CardSelectBottomSheet({
  open,
  onClose,
  selectedCardId,
  onSelect,
}: CardSelectBottomSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} overlay>
      <div className="flex h-full flex-col">
        <h2 className="px-4 pb-4 text-[1.0625rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100">
          카드 선택
        </h2>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <ul className="grid grid-cols-2 gap-[0.625rem]">
            {CREDIT_CARD_OPTIONS.map((card) => {
              const active = card.id === selectedCardId;
              return (
                <li key={card.id}>
                  <Press
                    type="button"
                    onClick={() => {
                      onSelect(card.id);
                      onClose();
                    }}
                    className={`flex h-[3.25rem] w-full items-center justify-center rounded-[0.75rem] px-4 py-[0.625rem] text-[0.875rem] leading-[1.55] font-semibold tracking-[-0.02em] text-neutral-100 ${
                      active
                        ? "border-[1.5px] border-orange-500"
                        : "border border-neutral-800"
                    }`}
                  >
                    {card.name}
                  </Press>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </BottomSheet>
  );
}
