import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import {
  LabBasicInfo,
  LabBottomBar,
  LabImageCarousel,
  LabLocationSection,
  LabNoticeSection,
  LabWorkResultsSection,
} from "@/components/photoLab/detail";
import { MOCK_LAB_DETAIL } from "@/constants/photoLab";
import type { PhotoLabDetail } from "@/types/photoLab";

export default function PhotoLabDetailPage() {
  const navigate = useNavigate();
  const [lab, setLab] = useState<PhotoLabDetail>(MOCK_LAB_DETAIL);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFavoriteToggle = () => {
    setLab((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleReservation = () => {
    navigate(`/photolab/${lab.photoLabId}/reservation`, {
      state: { labName: lab.name },
    });
  };

  const imageUrls = lab.images
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((img) => img.imageUrl);

  return (
    <div className="flex w-full flex-col">
      <Header title="파인더스 상도점" showBack onBack={handleBack} />

      <main className="pb-32">
        {/* 메인 이미지 캐러셀 */}
        <div className="-mx-4">
          <LabImageCarousel images={imageUrls} altPrefix={lab.name} />
        </div>

        {/* 기본 정보 */}
        <LabBasicInfo lab={lab} onFavoriteToggle={handleFavoriteToggle} />

        {/* 주요 공지 */}
        <LabNoticeSection notices={lab.notices} />

        {/* 작업 결과물 */}
        <LabWorkResultsSection //추후 Figma 디자인에 맞는 방식으로 변경 필요
          labName={lab.name}
          workResults={lab.workResults}
          onMoreClick={() => navigate("/photoFeed")}
        />

        {/* 지도 */}
        <LabLocationSection
          address={lab.address}
          distanceKm={lab.distanceKm}
          location={lab.location}
          labName={lab.name}
        />
      </main>

      <LabBottomBar onReservationClick={handleReservation} />
    </div>
  );
}
