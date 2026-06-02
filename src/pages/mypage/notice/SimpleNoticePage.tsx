import type { NoticeItem } from "@/types/mypage/notice";
import { formatYmdDot } from "@/utils/dateFormat";

const mockNoticeDetail: NoticeItem = {
  id: 1,
  title: "파인더스 새로워진 검색을 소개합니다",
  type: "GENERAL",
  createdAt: "2025-01-01T10:00:00Z",
  content:
    "안녕하세요. 파인더스입니다.\n파인더스의 공지사항이 새로워집니다.\n\n아래 내용을 잘 읽어보세요.",
  isNew: true,
};

export function SimpleNoticePage() {
  const date = formatYmdDot(mockNoticeDetail.createdAt);
  return (
    <div className="flex flex-col gap-5.5">
      <header className="flex flex-col gap-3 px-1 py-5">
        <p className="text-[1.125rem] leading-[126%] font-normal tracking-[-0.02125rem]">
          {mockNoticeDetail.title}
        </p>
        <p className="text-[0.9rem] leading-[155%] tracking-[-0.01625rem] text-neutral-600">
          {date}
        </p>
      </header>
      <main className="px-1">
        <p className="text-[1rem] leading-[155%] tracking-[-0.01875rem] whitespace-pre-wrap">
          {mockNoticeDetail.content}
        </p>
      </main>
    </div>
  );
}
