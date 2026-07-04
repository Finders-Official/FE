import { useState, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  promotionBanner1,
  promotionBanner2,
  promotionBanner3,
} from "@/assets/images";
import { useRequireAuth } from "@/hooks/mainPage/useRequireAuth";
import { useAuthStore } from "@/store/useAuth.store";

interface MainBannerProps {
  id: number;
  alt: string;
  src: string;
  onClick?: () => void;
}

export default function PromotionBanner() {
  const navigate = useNavigate();
  const { requireAuth } = useRequireAuth();
  const user = useAuthStore((s) => s.user);
  const isAuthed = Boolean(user?.memberId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];
    const objectUrl = URL.createObjectURL(selectedFile);

    navigate("/restore/editor", {
      state: { imageUrl: objectUrl },
    });

    e.target.value = "";
  };

  const handleRestoreClick = () => {
    if (!isAuthed) {
      requireAuth(() => fileInputRef.current?.click());
      return;
    }
    fileInputRef.current?.click();
  };

  const BANNERS: MainBannerProps[] = [
    {
      id: 1,
      alt: "AI 사진 복원 프로모션 배너",
      src: promotionBanner1,
      onClick: handleRestoreClick,
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
      {/* 사진 복원용 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex w-full snap-x snap-mandatory gap-3 overflow-x-auto px-5"
      >
        {BANNERS.map((banner) => (
          <div
            key={banner.id}
            className="min-w-[calc(100%-3px)] shrink-0 snap-center"
            onClick={banner.onClick}
            role={banner.onClick ? "button" : undefined}
            style={banner.onClick ? { cursor: "pointer" } : undefined}
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

      {/* 페이지네이션 도트 */}
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
