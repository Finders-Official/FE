import { useEffect, useRef } from "react";
import Header from "@/components/mainPage/Header";
import PromotionBanner from "@/components/mainPage/PromotionBanner";
import QuickMenuButton from "@/components/mainPage/QuickMenuButton";
import PopularLabsSection from "@/components/mainPage/PopularLabsSection/PopularLabsSection";
import FilmNewsSection from "@/components/mainPage/FilmNewsSection/FilmNewsSection";
import CommunityGallerySection from "@/components/mainPage/ComunityGallarySection/CommunityGallerySection";
import NoticeSection from "@/components/mainPage/NoticeSection/NoticeSection";

export default function MainPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resetScroll = () => {
      // 모달/바텀시트 등이 남긴 scroll lock 해제
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";

      const el = scrollRef.current;
      if (!el) return;

      // scroll layer 재생성 (iOS + Android 공통)
      el.style.overflowY = "hidden";
      el.getBoundingClientRect();
      el.style.overflowY = "";
    };

    const onPageShow = () => resetScroll(); // iOS bfcache 복원 대응
    const onFocus = () => resetScroll(); // Android resume 대응

    resetScroll();

    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return (
    <div
      ref={scrollRef}
      style={{
        WebkitOverflowScrolling: "auto",
        touchAction: "pan-y",
      }}
      className="scrollbar-hide mx-auto h-dvh w-full max-w-sm overflow-y-auto overscroll-y-none bg-neutral-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white"
    >
      <Header />
      <PromotionBanner />
      <QuickMenuButton />
      <PopularLabsSection />
      <FilmNewsSection />
      <CommunityGallerySection />
      <NoticeSection />
    </div>
  );
}
