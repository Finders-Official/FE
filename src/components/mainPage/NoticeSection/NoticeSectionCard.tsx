import { useNavigate } from "react-router";
import type { PhotoLabNoticeRolling } from "@/types/photoLab";
import { NOTICE_TYPE_LABEL } from "@/constants/photoLab";
import { NoticeLocationIcon, NoticeTimeIcon } from "@/assets/icon";

interface NoticeSectionCardProps {
  notice: PhotoLabNoticeRolling;
}

export default function NoticeSectionCard({ notice }: NoticeSectionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/photolab/${notice.photoLabId}`);
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className="group bg-neutral-875/50 flex h-54.75 w-50 cursor-pointer flex-col justify-between overflow-hidden rounded-[0.625rem] border border-neutral-800 p-5"
    >
      <div className="flex flex-col items-start gap-3">
        <span className="flex items-center justify-center rounded-[6.25rem] bg-orange-500 px-2.5 py-1 text-[0.625rem] font-semibold text-neutral-100">
          {NOTICE_TYPE_LABEL[notice.noticeType]}
        </span>

        <h3 className="line-clamp-3 text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-100">
          {notice.noticeTitle}
        </h3>
      </div>

      <div className="flex flex-col gap-[0.5] pt-3">
        <div className="flex items-center gap-1.5">
          <NoticeLocationIcon className="h-3 w-3" />
          <span className="text-[0.75rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-100">
            {notice.photoLabName}
          </span>
        </div>

        {notice.startDate && notice.endDate && (
          <div className="flex items-center gap-1.5">
            <NoticeTimeIcon className="h-3 w-3" />
            <span className="text-[0.75rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-100">
              {notice.startDate}~{notice.endDate}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
