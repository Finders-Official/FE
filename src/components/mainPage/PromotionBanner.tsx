import { useState, useRef } from "react";
import { Link } from "react-router";
import MainBannerAiIcon from "@/assets/mocks/mock-main-banner-ai.svg";

interface MainBannerProps {
  id: number;
  title: string;
  description: string;
  link: string;
  imageAlt: string;
  Image: string;
}

const BANNERS: MainBannerProps[] = [
  {
    id: 1,
    title: "타버린 사진도,\nAI로 다시 살려요",
    description: "타거나 잘못 찍힌 사진도 복원가능!",
    link: "/event/ai-restore",
    imageAlt: "AI 복원 아이콘",
    Image: MainBannerAiIcon,
  },
  {
    id: 2,
    title: "첫 현상이라면\n50% 할인 혜택",
    description: "필름 감성을 더 저렴하게",
    link: "/event/welcome-discount",
    imageAlt: "할인 쿠폰 아이콘",
    Image: MainBannerAiIcon,
  },
  {
    id: 3,
    title: "친구 초대하고\n무료 필름 받자",
    description: "너도 나도 1롤씩 GET",
    link: "/event/invite-friend",
    imageAlt: "필름 아이콘",
    Image: MainBannerAiIcon,
  },
];

export default function PromotionBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const totalScrollWidth = scrollRef.current.scrollWidth;
    const itemWidth = totalScrollWidth / BANNERS.length;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="promotion-banner-wrapper relative h-[276px] w-full py-2">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex h-full w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-8"
      >
        {BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="flex h-full min-w-[calc(100%-40px)] shrink-0 snap-center flex-col"
          >
            <Link to={banner.link} className="group block h-full">
              <div className="relative flex h-full w-full items-center overflow-hidden rounded-[16px] bg-orange-500 px-6 transition-transform duration-200 active:scale-[0.98]">
                <div className="z-10 flex max-w-[65%] flex-col gap-3">
                  <h2 className="absolute top-[120px] text-[22px] leading-tight font-semibold whitespace-pre-wrap text-neutral-100">
                    {banner.title}
                  </h2>
                  <p className="absolute top-[180px] text-sm font-medium text-neutral-100">
                    {banner.description}
                  </p>
                </div>
                <div className="absolute top-[29px] right-[30px] h-[137px] w-[114px]">
                  <img
                    src={banner.Image}
                    alt={banner.imageAlt}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* 페이지네이션 도트 */}
      <div className="pointer-events-none absolute right-0 bottom-2 left-0 flex justify-center gap-2">
        {BANNERS.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? "w-1 scale-125 bg-orange-500"
                : "w-1 bg-neutral-400"
            } `}
          />
        ))}
      </div>
    </div>
  );
}
