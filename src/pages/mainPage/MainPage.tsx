import { useEffect, useRef } from "react";
import Header from "@/components/mainPage/Header";
import PromotionBanner from "@/components/mainPage/PromotionBanner";
import PopularLabsSection from "@/components/mainPage/PopularLabsSection/PopularLabsSection";
import FilmNewsSection from "@/components/mainPage/FilmNewsSection/FilmNewsSection";
import CommunityGallerySection from "@/components/mainPage/ComunityGallarySection/CommunityGallerySection";
import Footer from "@/components/mainPage/Footer";
import { useAnchorScroll } from "@/hooks/common";

const SectionWrapper = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => <div data-anchor={id}>{children}</div>;

export default function MainPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

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
        className="scrollbar-hide flex-1 overflow-y-auto overscroll-y-none pb-(--tabbar-height)"
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
        <Footer />
      </div>
    </div>
  );
}
