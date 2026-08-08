import { useEffect, useRef } from "react";
import Header from "@/components/mainPage/Header";
import PromotionBanner from "@/components/mainPage/PromotionBanner";
import PopularLabsSection from "@/components/mainPage/PopularLabsSection/PopularLabsSection";
import FilmNewsSection from "@/components/mainPage/FilmNewsSection/FilmNewsSection";
import CommunityGallerySection from "@/components/mainPage/ComunityGallarySection/CommunityGallerySection";
import Footer from "@/components/mainPage/Footer";
import { useAnchorScroll } from "@/hooks/common";
import { prefetchGeolocation } from "@/hooks/common/useGeolocation";

const SectionWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => (
  <div data-anchor={id} className="mx-auto w-full max-w-sm">
    {children}
  </div>
);

export default function MainPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 로그인 직후 랜딩 시점에 위치 권한을 미리 요청
  useEffect(() => {
    prefetchGeolocation();
  }, []);

  useEffect(() => {
    const resetScroll = () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      const el = scrollRef.current;
      if (!el) return;
      el.style.overflowY = "hidden";
      el.getBoundingClientRect();
      el.style.overflowY = "";
    };

    resetScroll();
    window.addEventListener("pageshow", resetScroll);
    window.addEventListener("focus", resetScroll);
    return () => {
      window.removeEventListener("pageshow", resetScroll);
      window.removeEventListener("focus", resetScroll);
    };
  }, []);

  useAnchorScroll(scrollRef);

  return (
    <div className="mx-auto flex h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-sm flex-col bg-neutral-900 text-white">
      <Header />
      <div
        ref={scrollRef}
        className="scrollbar-hide relative ml-[calc(50%-50vw)] w-screen flex-1 overflow-x-hidden overflow-y-auto pb-(--tabbar-height)"
      >
        <SectionWrapper id="promotion">
          <PromotionBanner />
        </SectionWrapper>
        <SectionWrapper id="popular-labs">
          <PopularLabsSection />
        </SectionWrapper>
        <SectionWrapper id="film-news">
          <FilmNewsSection />
        </SectionWrapper>
        <SectionWrapper id="community">
          <CommunityGallerySection />
        </SectionWrapper>
        <div className="mx-auto w-full max-w-sm">
          <Footer />
        </div>
      </div>
    </div>
  );
}
