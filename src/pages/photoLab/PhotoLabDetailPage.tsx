import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "@/components/common";
import {
  LabBasicInfo,
  LabBottomBar,
  LabImageCarousel,
  LabLocationSection,
  LabNoticeSection,
  LabWorkResultsSection,
} from "@/components/photoLab/detail";
import {
  usePhotoLabDetail,
  useGeolocation,
  useFavoriteToggle,
} from "@/hooks/photoLab";

export default function PhotoLabDetailPage() {
  const navigate = useNavigate();
  const { photoLabId } = useParams();
  const { latitude, longitude } = useGeolocation();
  const { mutate: toggleFavorite } = useFavoriteToggle();

  const {
    data: lab,
    isLoading,
    error,
  } = usePhotoLabDetail(
    photoLabId ? parseInt(photoLabId) : undefined,
    latitude && longitude ? { lat: latitude, lng: longitude } : undefined,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFavoriteToggle = () => {
    if (!lab) return;
    toggleFavorite({
      photoLabId: lab.photoLabId,
      isFavorite: lab.isFavorite,
    });
  };

  const handleReservation = () => {
    if (!lab) return;
    navigate(`/photolab/${lab.photoLabId}/reservation`, {
      state: { labName: lab.name },
    });
  };

  // TODO: Skeleton UI로 교체
  if (isLoading) {
    return (
      <div className="flex w-full flex-col">
        <Header title="" showBack onBack={handleBack} />
      </div>
    );
  }

  // 에러 상태
  if (error || !lab) {
    return (
      <div className="flex w-full flex-col">
        <Header title="" showBack onBack={handleBack} />
        <div className="flex h-64 items-center justify-center">
          <span className="text-neutral-400">
            현상소 정보를 불러올 수 없습니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Header title={lab.name} showBack onBack={handleBack} />

      <main className="pb-32">
        {/* 메인 이미지 캐러셀 */}
        <div className="-mx-4">
          <LabImageCarousel images={lab.imageUrls} altPrefix={lab.name} />
        </div>

        {/* 기본 정보 */}
        <LabBasicInfo lab={lab} onFavoriteToggle={handleFavoriteToggle} />

        {/* 주요 공지 */}
        <LabNoticeSection notice={lab.mainNotice} />

        {/* 작업 결과물 */}
        <LabWorkResultsSection
          labName={lab.name}
          postImageUrls={lab.postImageUrls}
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
