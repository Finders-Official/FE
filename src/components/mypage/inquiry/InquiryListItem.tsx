import { useState } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import { formatYmdDot } from "@/utils/dateFormat";
import type { InquiryItem, InquiryType } from "@/types/mypage/inquiry";
import { Collapse } from "@/components/common";

// 문의 유형 영문을 한글 라벨로 변환하는 매핑 객체
const INQUIRY_TYPE_LABEL: Record<InquiryType, string> = {
  SERVICE_ERROR: "서비스 이용 오류",
  MEMBER_INFO: "회원정보/정보변경",
  PROMOTION: "프로모션/크레딧",
  PAYMENT: "결제",
};

interface InquiryListItemProps {
  item: InquiryItem;
}

export function InquiryListItem({ item }: InquiryListItemProps) {
  // 접기/펴기 상태 관리
  const [isExpanded, setIsExpanded] = useState(false);

  const typeLabel = INQUIRY_TYPE_LABEL[item.type] || item.type;
  const date = formatYmdDot(item.createdAt);

  return (
    <div
      className="flex cursor-pointer flex-col border-b border-neutral-800 px-1 py-5"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* 1. 상단: 문의 유형 및 토글 아이콘 */}
      <div className="flex items-center justify-between">
        <span className="text-[1rem] font-medium text-neutral-100">
          {typeLabel}
        </span>
        <ChevronLeftIcon
          // 펴졌을 때 위로(rotate-90), 접혔을 때 아래로(-rotate-90) 향하게 회전
          className={`ease-smooth-out h-5 w-5 text-neutral-500 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none ${
            isExpanded ? "rotate-90" : "-rotate-90"
          }`}
        />
      </div>

      {/* 2. 중단: 사용자가 작성한 문의 내용 (펼쳤을 때만 노출) */}
      <Collapse open={isExpanded}>
        <div className="mt-3 text-left text-[0.875rem] leading-[150%] whitespace-pre-wrap text-neutral-200">
          {item.content}
        </div>
      </Collapse>

      {/* 3. 하단: 답변 상태 뱃지 및 작성 날짜 (항상 노출) */}
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`flex h-[1.375rem] items-center justify-center rounded px-1.5 text-[0.75rem] font-medium ${
            item.status !== "PENDING"
              ? "bg-orange-450 text-neutral-100"
              : "bg-neutral-800 text-neutral-200"
          }`}
        >
          {item.status !== "PENDING" ? "답변 완료" : "답변 대기"}
        </span>
        <span className="text-[0.875rem] text-neutral-300">{date}</span>
      </div>

      {/* 4. 답변 박스: 펼쳐져 있고, 답변이 완료된 상태일 때만 노출 */}
      {item.status !== "PENDING" && item.hasReply && item.replyContent && (
        <Collapse open={isExpanded}>
          <div className="bg-neutral-850 mt-4 flex flex-col rounded-lg p-4">
            <span className="text-left text-[0.875rem] leading-[150%] whitespace-pre-wrap text-neutral-100">
              {item.replyContent}
            </span>
            <span className="mt-3 text-right text-[0.75rem] text-neutral-500">
              {item.replyCreatedAt ? formatYmdDot(item.replyCreatedAt) : ""}
            </span>
          </div>
        </Collapse>
      )}
    </div>
  );
}
