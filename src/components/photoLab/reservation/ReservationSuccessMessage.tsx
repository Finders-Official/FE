import { ConfirmationIcon } from "@/components/common";

export default function ReservationSuccessMessage() {
  return (
    <section className="border-neutral-850 -mx-4 flex flex-col items-center gap-[1.375rem] border-b-[6px] px-4 py-[1.875rem]">
      <ConfirmationIcon className="h-[3rem] w-[3rem]" />
      <div className="flex flex-col items-center gap-0.5">
        <h1 className="text-[1.125rem] leading-[155%] font-semibold tracking-[-0.02em]">
          <span className="text-orange-500">현상소 예약</span>
          <span className="text-neutral-100">이 완료되었어요</span>
        </h1>
        <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-500">
          정성을 담아 소중한 추억을 현상해드릴게요
        </p>
      </div>
    </section>
  );
}
