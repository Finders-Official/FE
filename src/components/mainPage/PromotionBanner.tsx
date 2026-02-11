import { useState, useRef } from "react";
import {
  PromotionBannerIcon1,
  PromotionBannerIcon2,
  PromotionBannerIcon3,
} from "@/assets/icon";

interface MainBannerProps {
  id: number;
  alt: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// TODO: 배너 이미지 교체 필요
const BANNERS: MainBannerProps[] = [
  {
    id: 1,
    alt: "AI 사진 복원 프로모션 배너",
    Icon: PromotionBannerIcon1,
  },
  {
    id: 2,
    alt: "첫 현상 50% 할인 프로모션 배너",
    Icon: PromotionBannerIcon2,
  },
  {
    id: 3,
    alt: "친구 초대 혜택 프로모션 배너",
    Icon: PromotionBannerIcon3,
  },
];

export default function PromotionBanner() {
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
        {BANNERS.map((banner) => {
          const BannerIcon = banner.Icon;

          return (
            <div
              key={banner.id}
              className="min-w-[calc(100%-3px)] shrink-0 snap-center"
            >
              <div className="relative aspect-335/250 w-full overflow-hidden rounded-2xl">
                <BannerIcon
                  role="img"
                  aria-label={banner.alt}
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                />
              </div>
            </div>
          );
        })}
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
