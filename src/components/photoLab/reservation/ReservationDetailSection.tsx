import { TextArea } from "@/components/common";
import {
  CalendarIcon,
  ClockIcon,
  BriefcaseIcon,
  ChatBubbleIcon,
  PencilLineIcon,
} from "@/assets/icon";
import ReservationInfoRow from "@/components/photoLab/reservation/ReservationInfoRow";

interface ReservationDetailSectionProps {
  schedule: string;
  estimatedCompletion?: string;
  taskSummary: string;
  memo?: string;
  labMessage?: string;
  labName: string;
}

export default function ReservationDetailSection({
  schedule,
  estimatedCompletion,
  taskSummary,
  memo,
  labMessage,
  labName,
}: ReservationDetailSectionProps) {
  return (
    <section className="flex flex-col gap-[1.125rem] py-[1.875rem]">
      <h2 className="text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
        예약 내역
      </h2>

      <div className="flex flex-col gap-5">
        <ReservationInfoRow
          icon={<CalendarIcon className="h-3.5 w-3.5 text-neutral-200" />}
          label="일정"
          value={schedule}
        />

        {estimatedCompletion && (
          <ReservationInfoRow
            icon={<ClockIcon className="h-3.5 w-3.5 text-neutral-200" />}
            label="예상 완료 시점"
            value={estimatedCompletion}
          />
        )}

        <ReservationInfoRow
          icon={<BriefcaseIcon className="h-3.5 w-3.5 text-neutral-200" />}
          label="작업 옵션"
          value={taskSummary}
        />

        {/* 요청사항 - 없으면 안보임 */}
        {memo && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <div className="flex h-6 w-6 items-center justify-center">
                <ChatBubbleIcon className="h-3.5 w-3.5 text-neutral-200" />
              </div>
              <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                요청사항
              </span>
            </div>
            <TextArea value={memo} onChange={() => {}} disabled />
          </div>
        )}

        {/* 현상소에서 드리는 글 - 없으면 안보임*/}
        {labMessage && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <div className="flex h-6 w-6 items-center justify-center">
                <PencilLineIcon className="h-3.5 w-3.5 text-neutral-200" />
              </div>
              <span className="text-base leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                {labName}에서 드리는 글
              </span>
            </div>
            <TextArea value={labMessage} onChange={() => {}} disabled />
          </div>
        )}
      </div>
    </section>
  );
}
