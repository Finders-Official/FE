import type { PhotoLabNotice } from "@/types/photoLab";

interface LabNoticeSectionProps {
  notice: PhotoLabNotice | null;
  className?: string;
}

function getNoticeTypeLabel(type: "EVENT" | "NOTICE"): string {
  return type === "EVENT" ? "이벤트" : "공지";
}

export default function LabNoticeSection({
  notice,
  className = "",
}: LabNoticeSectionProps) {
  if (!notice) return null;

  return (
    <div className={`py-[1.875rem] ${className}`}>
      <h3 className="mb-4 text-[1.25rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
        주요 공지
      </h3>

      <div className="bg-neutral-875 flex flex-col gap-2.5 rounded-[0.625rem] p-5">
        <div className="flex items-center gap-2">
          <span className="bg-neutral-750 shrink-0 rounded-full px-2 py-1 text-[0.625rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-200">
            {getNoticeTypeLabel(notice.noticeType)}
          </span>
          <span className="text-[0.8125rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
            {notice.title}
          </span>
        </div>
      </div>
    </div>
  );
}
