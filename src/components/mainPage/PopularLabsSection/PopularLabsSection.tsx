import { useState, useRef } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import PopularLabCard, { type Lab } from "./PopularLabCard";

// Mock Data
const POPULAR_LABS: Lab[] = [
  {
    id: 1,
    name: "파인더스 현상소 흑석점",
    thumbnail:
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    workCount: 52,
    tags: ["예약 가능", "따뜻한 현상"],
  },
  {
    id: 2,
    name: "고래사진관 충무로점",
    thumbnail:
      "https://www.papershoot.com/cdn/shop/files/paper-shoot-1925_b3e88654-71d8-4730-b14b-550857a4bc7b.jpg?v=1751552327&width=416",
    workCount: 128,
    tags: ["예약 가능", "따뜻한 현상"],
  },
  {
    id: 3,
    name: "망우삼림",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
    workCount: 1042,
    tags: ["예약 가능", "따뜻한 현상"],
  },
  {
    id: 4,
    name: "연남 필름",
    thumbnail:
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80",
    workCount: 340,
    tags: ["예약 가능", "따뜻한 현상"],
  },
  {
    id: 5,
    name: "일삼오삼육",
    thumbnail:
      "https://www.papershoot.com/cdn/shop/files/paper-shoot-1925_b3e88654-71d8-4730-b14b-550857a4bc7b.jpg?v=1751552327&width=416",
    workCount: 88,
    tags: ["택배 가능", "꼼꼼함"],
  },
  {
    id: 6,
    name: "다크룸 강남",
    thumbnail:
      "https://www.papershoot.com/cdn/shop/files/paper-shoot-1925_b3e88654-71d8-4730-b14b-550857a4bc7b.jpg?v=1751552327&width=416",
    workCount: 45,
    tags: ["흑백 전문", "현상 교육"],
  },
  {
    id: 7,
    name: "포토로그",
    thumbnail:
      "https://www.papershoot.com/cdn/shop/files/paper-shoot-1925_b3e88654-71d8-4730-b14b-550857a4bc7b.jpg?v=1751552327&width=416",
    workCount: 210,
    tags: ["가성비", "학생 할인"],
  },
  {
    id: 8,
    name: "스코피 홍대점",
    thumbnail:
      "https://www.papershoot.com/cdn/shop/files/paper-shoot-1925_b3e88654-71d8-4730-b14b-550857a4bc7b.jpg?v=1751552327&width=416",
    workCount: 67,
    tags: ["대량 작업", "인화 무료"],
  },
];

export default function PopularLabsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 데이터 4개씩 묶기 (Chunking) -> [[1,2,3,4], [5,6,7,8]]
  const chunkedLabs = [];
  for (let i = 0; i < POPULAR_LABS.length; i += 4) {
    chunkedLabs.push(POPULAR_LABS.slice(i, i + 4));
  }

  // 스크롤 이벤트 핸들러 (현재 페이지 계산)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const clientWidth = scrollRef.current.clientWidth;
    // 전체 너비 기준 현재 페이지 인덱스 계산
    const newIndex = Math.round(scrollLeft / clientWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <section className="flex flex-col gap-4 py-6">
      {/* 헤더 */}
      <div className="px-5">
        <SectionHeader title="이번주 인기있는 현상소" link="/" />
      </div>

      <div className="relative w-full">
        {/* 가로 스크롤 컨테이너 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto pb-8"
        >
          {chunkedLabs.map((group, groupIndex) => (
            // 슬라이드 (페이지) 단위
            <div
              key={groupIndex}
              className="min-w-full shrink-0 snap-center px-5"
            >
              {/* 2x2 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                {group.map((lab) => (
                  <PopularLabCard key={lab.id} lab={lab} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 도트 */}
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center gap-1">
          {chunkedLabs.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-1 bg-orange-500"
                  : "w-1 bg-neutral-400"
              } `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// SectionHeader 링크 수정
