import type { NoticeItem } from "@/types/mypage/notice";
import { formatYmdDot } from "@/utils/dateFormat";
import { Link } from "react-router";

interface NoticeListItemProps {
  data: NoticeItem;
}

// 타입에 따라 이동할 pathname을 결정
const getNoticePath = (type: string) => {
  switch (type) {
    case "GENERAL":
      return "./general";
    case "EVENT":
      return "./event";
    case "POLICY":
      return "./policy";
    default:
      return "/mypage/notice";
  }
};

export function NoticeListItem({ data }: NoticeListItemProps) {
  // 날짜 포맷 함수 적용
  const date = formatYmdDot(data.createdAt);

  // 경로와 쿼리 파라미터를 조합
  const targetUrl = `${getNoticePath(data.type)}?id=${data.id}`;

  return (
    <Link
      to={targetUrl}
      className="flex w-full cursor-pointer flex-col gap-1.5 border-b border-neutral-800 px-6 py-4 transition-colors hover:bg-neutral-900"
    >
      <div className="flex items-start gap-1">
        <p className="text-[1rem] leading-[155%] font-normal tracking-[-0.01875rem] text-white">
          {data.title}
        </p>
        {/* 새로운 공지일 때만 주황색 점 노출 */}
        {data.isNew && (
          <p className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-orange-500" />
        )}
      </div>
      <p className="text-[0.875rem] leading-[126%] font-normal tracking-[-0.015rem] text-neutral-300">
        {date}
      </p>
    </Link>
  );
}
