import { ChevronLeftIcon } from "@/assets/icon";
import { Press } from "@/components/common/motion";

interface CardSelectButtonProps {
  selectedName: string | null;
  onClick: () => void;
  /** 연결된 카드 선택 시트의 열림 상태 — 셰브론 회전용 */
  isOpen?: boolean;
}

export function CardSelectButton({
  selectedName,
  onClick,
  isOpen = false,
}: CardSelectButtonProps) {
  return (
    <Press
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      className="flex h-[3.1875rem] w-full items-center justify-between rounded-[0.625rem] border border-neutral-800 px-4 py-[0.875rem]"
    >
      <span
        className={`text-[0.9375rem] leading-[1.55] font-normal tracking-[-0.02em] ${
          selectedName ? "text-neutral-100" : "text-neutral-600"
        }`}
      >
        {selectedName ?? "카드 선택"}
      </span>
      <ChevronLeftIcon
        className={`ease-smooth-out h-6 w-6 text-neutral-200 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none ${
          isOpen ? "rotate-90" : "-rotate-90"
        }`}
      />
    </Press>
  );
}
