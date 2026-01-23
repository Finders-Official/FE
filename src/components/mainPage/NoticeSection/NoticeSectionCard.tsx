import { Link } from "react-router";

export interface NoticeData {
  id: number;
  type: "이벤트" | "공지" | "휴무"; // 태그 타입
  title: string;
  labName: string;
  labId: number;
  period: string;
}

interface NoticeSectionCardProps {
  notice: NoticeData;
}

export default function NoticeSectionCard({ notice }: NoticeSectionCardProps) {
  return (
    <Link
      to={`/lab/${notice.labId}`}
      className="group bg-neutral-875/50 flex h-[13.6875rem] w-[12.5rem] flex-col justify-between overflow-hidden rounded-[0.625rem] border border-neutral-800 p-5"
    >
      <div className="flex flex-col items-start gap-3">
        <span className="flex items-center justify-center rounded-[6.25rem] bg-orange-500 px-2.5 py-1 text-[0.625rem] font-semibold text-neutral-100">
          {notice.type}
        </span>

        {/* 제목 */}
        <h3 className="line-clamp-3 text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] whitespace-pre-wrap text-neutral-100">
          {notice.title}
        </h3>
      </div>

      <div className="flex flex-col gap-1.5 pt-3">
        {/* 현상소 이름 */}
        <div className="flex items-center gap-1.5 text-[#999999]">
          {/* 위치/핀 아이콘 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 7.58333C8.12767 7.58333 9.04167 6.66934 9.04167 5.54167C9.04167 4.41399 8.12767 3.5 7 3.5C5.87233 3.5 4.95833 4.41399 4.95833 5.54167C4.95833 6.66934 5.87233 7.58333 7 7.58333Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.375 5.54169C11.375 9.18752 7 12.5417 7 12.5417C7 12.5417 2.625 9.18752 2.625 5.54169C2.625 4.38137 3.08594 3.26857 3.90641 2.4481C4.72688 1.62763 5.83968 1.16669 7 1.16669C8.16032 1.16669 9.27312 1.62763 10.0936 2.4481C10.9141 3.26857 11.375 4.38137 11.375 5.54169V5.54169Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[0.75rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-100">
            {notice.labName}
          </span>
        </div>

        {/* 기간 */}
        <div className="flex items-center gap-1.5 text-[#999999]">
          {/* 시계 아이콘 */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 12.8333C10.2217 12.8333 12.8333 10.2217 12.8333 7C12.8333 3.77834 10.2217 1.16666 7 1.16666C3.77834 1.16666 1.16667 3.77834 1.16667 7C1.16667 10.2217 3.77834 12.8333 7 12.8333Z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 3.5V7L9.33333 8.16667"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[0.75rem] leading-[126%] font-semibold tracking-[-0.02em] text-neutral-100">
            {notice.period}
          </span>
        </div>
      </div>
    </Link>
  );
}

// 아이콘 수정
// 카드 크기 하드코딩 수정
