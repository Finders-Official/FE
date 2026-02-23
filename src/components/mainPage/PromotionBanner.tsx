import { useState, useRef } from "react";
import { useNavigate } from "react-router"; // [demo-day] 데모데이 끝나면 제거
import {
  promotionBanner1,
  promotionBanner2,
  promotionBanner3,
} from "@/assets/images";

interface MainBannerProps {
  id: number;
  alt: string;
  src: string;
  link?: string; // [demo-day] 데모데이 끝나면 제거
}

const BANNERS: MainBannerProps[] = [
  {
    id: 1,
    alt: "AI 사진 복원 프로모션 배너",
    src: promotionBanner1,
    link: "/demo-day", // [demo-day] 데모데이 끝나면 제거
  },
  {
    id: 2,
    alt: "첫 현상 50% 할인 프로모션 배너",
    src: promotionBanner2,
  },
  {
    id: 3,
    alt: "친구 초대 혜택 프로모션 배너",
    src: promotionBanner3,
  },
];

export default function PromotionBanner() {
  const navigate = useNavigate(); // [demo-day] 데모데이 끝나면 제거
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const itemWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollRef.current.scrollLeft / itemWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="promotion-banner-wrapper w-full py-2">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5"
      >
        {BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="min-w-[calc(100%-3px)] shrink-0 snap-center"
            // [demo-day] 아래 3줄 데모데이 끝나면 제거
            onClick={banner.link ? () => navigate(banner.link!) : undefined}
            role={banner.link ? "link" : undefined}
            style={banner.link ? { cursor: "pointer" } : undefined}
          >
            <div className="relative aspect-335/250 w-full overflow-hidden rounded-2xl">
              <img
                src={banner.src}
                alt={banner.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 패이지네이션 도트 */}
      <div className="mt-4 flex justify-center gap-2">
        {BANNERS.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-1 bg-orange-500"
                : "w-1 bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
