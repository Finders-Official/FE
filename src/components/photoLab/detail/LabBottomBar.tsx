interface LabBottomBarProps {
  onInquiryClick?: () => void;
  onReservationClick?: () => void;
}

export default function LabBottomBar({
  onInquiryClick,
  onReservationClick,
}: LabBottomBarProps) {
  return (
    <div className="fixed right-0 bottom-0 left-0 flex justify-center border-t border-neutral-800 bg-neutral-900 px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,2.125rem))]">
      <button
        type="button"
        onClick={onInquiryClick}
        className="mr-3 flex h-16 w-[8.5rem] items-center justify-center rounded-2xl border border-neutral-700 bg-transparent text-[1.125rem] leading-[150%] font-semibold tracking-[-0.023em] text-neutral-200 active:scale-[0.99]"
      >
        문의
      </button>
      <button
        type="button"
        onClick={onReservationClick}
        className="flex h-16 w-[14rem] items-center justify-center rounded-2xl bg-orange-500 text-[1.125rem] leading-[150%] font-semibold tracking-[-0.023em] text-neutral-100 active:scale-[0.99]"
      >
        예약하기
      </button>
    </div>
  );
}
