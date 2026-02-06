import { useState, useRef } from "react";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";
import { PromotionBannerAiIcon } from "@/assets/icon";

interface MainBannerProps {
  id: number;
  link: string;
  alt: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// TODO: 배너 이미지 교체 필요
const BANNERS: MainBannerProps[] = [
  {
    id: 1,
    link: "/event/ai-restore",
    alt: "AI 사진 복원 프로모션 배너",
    Icon: PromotionBannerAiIcon,
  },
  {
    id: 2,
    link: "/event/welcome-discount",
    alt: "첫 현상 50% 할인 프로모션 배너",
    Icon: PromotionBannerAiIcon,
  },
  {
    id: 3,
    link: "/event/invite-friend",
    alt: "친구 초대 혜택 프로모션 배너",
    Icon: PromotionBannerAiIcon,
  },
];

export default function PromotionBanner() {
  const { requireAuthNavigate } = useRequireAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const itemWidth = scrollRef.current.clientWidth;
    const newIndex = Math.round(scrollRef.current.scrollLeft / itemWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="promotion-banner-wrapper relative h-69 w-full py-2">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex h-full w-full snap-x snap-mandatory overflow-x-auto px-5 pb-8"
      >
        {BANNERS.map((banner) => {
          const BannerIcon = banner.Icon;

          return (
            <div
              key={banner.id}
              className="flex min-w-full shrink-0 snap-center justify-center"
            >
              <button
                type="button"
                onClick={() => requireAuthNavigate(banner.link)}
                className="relative aspect-335/250 w-full max-w-82.5 overflow-hidden rounded-2xl transition-transform duration-200 active:scale-[0.98]"
              >
                <BannerIcon
                  role="img"
                  aria-label={banner.alt}
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 도트 */}
      <div className="pointer-events-none absolute right-0 bottom-2 left-0 flex justify-center gap-2">
        {BANNERS.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-1 scale-125 bg-orange-500"
                : "w-1 bg-neutral-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
