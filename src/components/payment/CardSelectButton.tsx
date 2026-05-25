import { ChevronLeftIcon } from "@/assets/icon";

interface CardSelectButtonProps {
  selectedName: string | null;
  onClick: () => void;
}

export function CardSelectButton({
  selectedName,
  onClick,
}: CardSelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[3.1875rem] w-full items-center justify-between rounded-[0.625rem] border border-neutral-800 px-4 py-[0.875rem]"
    >
      <span
        className={`text-[0.9375rem] leading-[1.55] font-normal tracking-[-0.02em] ${
          selectedName ? "text-neutral-100" : "text-neutral-600"
        }`}
      >
        {selectedName ?? "카드 선택"}
      </span>
      <ChevronLeftIcon className="h-6 w-6 -rotate-90 text-neutral-200" />
    </button>
  );
}
