interface LabBottomBarProps {
  onReservationClick?: () => void;
}

export default function LabBottomBar({
  onReservationClick,
}: LabBottomBarProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 flex justify-center border-t border-neutral-800 bg-neutral-900 px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,2.125rem))]">
      <button
        type="button"
        onClick={onReservationClick}
        className="flex h-16 w-full items-center justify-center rounded-2xl bg-orange-500 text-[1.125rem] leading-[150%] font-semibold tracking-[-0.023em] text-neutral-100 active:scale-[0.99]"
      >
        예약하기
      </button>
    </div>
  );
}
