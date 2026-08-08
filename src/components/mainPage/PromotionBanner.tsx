import { useState, useRef } from "react";
import {
  promotionBanner1,
  promotionBanner2,
  promotionBanner3,
} from "@/assets/images";
import { PageDots } from "./PageDots";
import { Press } from "@/components/common/motion";

interface MainBannerProps {
  id: number;
  alt: string;
  src: string;
}

export default function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const BANNERS: MainBannerProps[] = [
    {
      id: 1,
      alt: "AI 사진 복원 프로모션 배너",
      src: promotionBanner1,
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
          <Press
            as="div"
            key={banner.id}
            className="min-w-[calc(100%-3px)] shrink-0 snap-center"
          >
            <div className="relative aspect-335/250 w-full overflow-hidden rounded-2xl">
              <img
                src={banner.src}
                alt={banner.alt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </Press>
        ))}
      </div>

      {/* 페이지네이션 도트 */}
      <PageDots
        count={BANNERS.length}
        activeIndex={currentIndex}
        className="mt-4 gap-2"
      />
    </div>
  );
}
