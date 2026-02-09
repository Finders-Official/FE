import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import PopularLabCard from "./PopularLabCard";
import { fetchPopularLabs, type Lab } from "@/apis/mainPage/mainPage.api";

export default function PopularLabsSection() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getPopularLabs = async () => {
      try {
        setIsLoading(true);
        const data = await fetchPopularLabs();
        setLabs(data);
      } catch (error) {
        console.error("Error fetching popular labs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getPopularLabs();
  }, []);

  // 데이터 4개씩 묶기 (Memoized)
  const chunkedLabs = useMemo(() => {
    const chunks: Lab[][] = [];
    for (let i = 0; i < labs.length; i += 4) {
      chunks.push(labs.slice(i, i + 4));
    }
    return chunks;
  }, [labs]);

  // 스크롤 이벤트 핸들러: 현재 보이는 페이지 인덱스 계산
  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const centerX = container.scrollLeft + container.clientWidth / 2;
    let bestIndex = 0;
    let minDistance = Infinity;

    const pages = Array.from(container.children) as HTMLElement[];
    pages.forEach((page, idx) => {
      const pageCenter = page.offsetLeft + page.clientWidth / 2;
      const distance = Math.abs(centerX - pageCenter);
      if (distance < minDistance) {
        minDistance = distance;
        bestIndex = idx;
      }
    });

    setCurrentPageIndex(bestIndex);
  }, []);

  // 로딩 중일 때 보여줄 스켈레톤 UI
  if (isLoading) {
    return (
      <section className="flex flex-col gap-4 py-6">
        <SectionHeader title="이번주 인기있는 현상소" link="/photolab" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-163/230 animate-pulse rounded-[1.25rem] bg-neutral-800"
            />
          ))}
        </div>
      </section>
    );
  }

  // 데이터가 없거나 로딩 실패 시 (기존 동작 유지)
  if (labs.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 py-6">
      <SectionHeader title="이번주 인기있는 현상소" link="/photolab" />

      <div className="relative w-full">
        {/* 가로 스크롤 컨테이너 */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="scrollbar-hide flex w-full snap-x snap-mandatory overflow-x-auto pb-8"
        >
          {chunkedLabs.map((group, groupIndex) => {
            // 기존 페이지 간격 스타일 유지
            const marginClass =
              groupIndex === 0
                ? "mr-2"
                : groupIndex === chunkedLabs.length - 1
                  ? "ml-2"
                  : "mx-2";

            return (
              <div
                key={groupIndex}
                className={`min-w-full shrink-0 snap-center ${marginClass}`}
              >
                <div className="grid grid-cols-2 gap-4">
                  {group.map((lab) => (
                    <PopularLabCard key={lab.photoLabId} lab={lab} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 페이지네이션 도트 */}
        {chunkedLabs.length > 1 && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center gap-1">
            {chunkedLabs.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentPageIndex === index
                    ? "w-1 bg-orange-500"
                    : "w-1 bg-neutral-400"
                } `}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
