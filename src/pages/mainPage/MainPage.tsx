import { useEffect, useRef } from "react";
import Header from "@/components/mainPage/Header";
import PromotionBanner from "@/components/mainPage/PromotionBanner";
import QuickMenuButton from "@/components/mainPage/QuickMenuButton";
import PopularLabsSection from "@/components/mainPage/PopularLabsSection/PopularLabsSection";
import FilmNewsSection from "@/components/mainPage/FilmNewsSection/FilmNewsSection";
import CommunityGallerySection from "@/components/mainPage/ComunityGallarySection/CommunityGallerySection";
import NoticeSection from "@/components/mainPage/NoticeSection/NoticeSection";
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
    <div
      ref={scrollRef}
      style={{
        WebkitOverflowScrolling: "auto",
        touchAction: "pan-y",
        overflowAnchor: "none",
      }}
      className="scrollbar-hide mx-auto h-dvh w-full max-w-sm overflow-y-auto overscroll-y-none bg-neutral-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-white"
    >
      <SectionWrapper id="header">
        <Header />
      </SectionWrapper>
      <SectionWrapper id="promotion">
        <PromotionBanner />
      </SectionWrapper>
      <SectionWrapper id="quick-menu">
        <QuickMenuButton />
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
      <SectionWrapper id="notice">
        <NoticeSection />
      </SectionWrapper>
    </div>
  );
}
