import NoticeSectionCard, { type NoticeData } from "./NoticeSectionCard";
import { SectionHeader } from "@/components/common/SectionHeader";

const NOTICE_LIST: NoticeData[] = [
  {
    id: 1,
    type: "이벤트",
    title: "첫방문 손님 대상\n10% 할인 이벤트",
    labName: "파인더스 동작점",
    labId: 101,
    period: "12.1~12.31까지",
  },
  {
    id: 2,
    type: "공지",
    title: "택배 접수 시작합니다",
    labName: "파인더스 동작점",
    labId: 101,
    period: "12.1~12.31까지",
  },
  {
    id: 3,
    type: "휴무",
    title: "크리스마스 연휴\n휴무 안내",
    labName: "고래사진관 충무로",
    labId: 102,
    period: "12.24~12.25",
  },
  {
    id: 4,
    type: "공지",
    title: "로모그래피\nMc-a 입고!",
    labName: "고래사진관 충무로",
    labId: 102,
    period: "12.24~12.25",
  },
];

export default function NoticeSection() {
  return (
    <section className="flex flex-col gap-3.5 py-6">
      {/* 헤더 */}
      <SectionHeader title="현상소에서 알려드립니다" />

      {/* 가로 스크롤 리스트 */}
      <div className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4">
        {NOTICE_LIST.map((notice) => (
          <div key={notice.id} className="flex-none snap-start">
            <NoticeSectionCard notice={notice} />
          </div>
        ))}
      </div>
    </section>
  );
}
