import type { NoticeItem } from "@/types/mypage/notice";

interface NoticeListItemProps {
  data: NoticeItem;
}

export function NoticeListItem({ data }: NoticeListItemProps) {
  // 1. 현재 날짜와 시작 날짜 비교 로직
  const today = new Date();
  // '2026.05.12' 형태를 '2026-05-12'로 바꿔서 Date 객체 생성
  const startDate = new Date(data.startDate.replace(/\./g, "-"));

  // 두 날짜의 차이 계산 (밀리초 -> 일 단위)
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 2. 시작일로부터 7일 이내(0~7일)라면 새로운 공지로 판별
  // (미래에 시작될 공지가 있을 수 있으므로 diffDays >= 0 조건 추가)
  const isNew = diffDays >= 0 && diffDays <= 7;

  return (
    <div className="flex w-full cursor-pointer flex-col gap-1.5 border-b border-neutral-800 px-6 py-4 transition-colors hover:bg-neutral-900">
      <div className="flex items-start gap-1">
        <p className="text-[1rem] leading-[155%] font-normal tracking-[-0.01875rem] text-white">
          {data.noticeTitle}
        </p>
        {/* 새로운 공지일 때만 주황색 점 노출 */}
        {isNew && (
          <p className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-orange-500" />
        )}
      </div>
      <p className="text-[0.875rem] leading-[126%] font-normal tracking-[-0.015rem] text-neutral-300">
        {data.startDate}
      </p>
    </div>
  );
}
