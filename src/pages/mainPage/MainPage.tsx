import Header from "@/components/mainPage/Header";
import PromotionBanner from "@/components/mainPage/PromotionBanner";
import QuickMenuButton from "@/components/mainPage/QuickMenuButton";
import PopularLabsSection from "@/components/mainPage/PopularLabsSection/PopularLabsSection";
import FilmNewsSection from "@/components/mainPage/FilmNewsSection/FilmNewsSection";
import CommunityGallerySection from "@/components/mainPage/ComunityGallarySection/CommunityGallerySection";
import NoticeSection from "@/components/mainPage/NoticeSection/NoticeSection";

export default function MainPage() {
  return (
    // min-h-screen -> h-screen (높이를 화면 크기에 딱 맞춤)
    <div className="scrollbar-hide mx-auto h-screen max-w-sm overflow-y-auto bg-neutral-900 pb-20 text-white">
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
