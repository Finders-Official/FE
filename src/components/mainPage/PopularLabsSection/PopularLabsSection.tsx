import { useState, useRef, useEffect } from "react";
import { SectionHeader } from "@/components/common/SectionHeader";
import PopularLabCard, { type Lab } from "./PopularLabCard";

interface ApiResponse {
  success: boolean;
  code: string;
  message: string;
  data: Lab[];
}

export default function PopularLabsSection() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPopularLabs = async () => {
      const baseUrl = import.meta.env.VITE_PUBLIC_API_URL;

      try {
        const response = await fetch(`${baseUrl}/photo-labs/popular`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP 에러! status: ${response.status}`);
        }

        const json: ApiResponse = await response.json();

        if (json.success) {
          setLabs(json.data);
        } else {
          console.error("Failed to fetch labs:", json.message);
        }
      } catch (error) {
        console.error("Error fetching popular labs:", error);
      }
    };

    fetchPopularLabs();
  }, []);

  // 데이터 4개씩 묶기
  const chunkedLabs = [];
  for (let i = 0; i < labs.length; i += 4) {
    chunkedLabs.push(labs.slice(i, i + 4));
  }

  // 스크롤 이벤트 핸들러
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const clientWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollLeft / clientWidth);
    setCurrentIndex(newIndex);
  };

  if (labs.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 py-6">
      <div>
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
            <div key={groupIndex} className="min-w-full shrink-0 snap-center">
              <div className="grid grid-cols-2 gap-4">
                {group.map((lab) => (
                  <PopularLabCard key={lab.photoLabId} lab={lab} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 도트 */}
        {chunkedLabs.length > 1 && (
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex justify-center gap-1">
            {chunkedLabs.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  currentIndex === index
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
