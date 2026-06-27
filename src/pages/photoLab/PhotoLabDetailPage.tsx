import { useLayoutEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "@/components/common";
import {
  LabBasicInfo,
  LabImageCarousel,
  LabLocationSection,
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
    photoLabId,
    latitude && longitude ? { lat: latitude, lng: longitude } : undefined,
  );

  useLayoutEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFavoriteToggle = (photoLabId: string, isFavorite: boolean) => {
    toggleFavorite({ photoLabId, isFavorite });
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
      <div className="sticky top-0 z-20 -mx-4 bg-neutral-900 px-4">
        <Header title={lab.name} showBack onBack={handleBack} />
      </div>

      <main className="pb-8">
        {/* 메인 이미지 캐러셀 */}
        <div className="-mx-4">
          <LabImageCarousel images={lab.imageUrls} altPrefix={lab.name} />
        </div>

        {/* 기본 정보 */}
        <LabBasicInfo lab={lab} onFavoriteToggle={handleFavoriteToggle} />

        {/* 주요 공지 */}
        {/* <LabNoticeSection notice={lab.mainNotice} /> */}

        {/* 작업 결과물 */}
        <LabWorkResultsSection
          labName={lab.name}
          postImageUrls={lab.postImageUrls}
          onMoreClick={() =>
            navigate("/photoFeed/search", {
              state: { labName: lab.name },
            })
          }
        />

        {/* 지도 */}
        <LabLocationSection
          address={lab.address}
          addressDetail={lab.addressDetail ?? undefined}
          distanceKm={lab.distanceKm}
          location={{ latitude: lab.latitude, longitude: lab.longitude }}
          labName={lab.name}
        />
      </main>
    </div>
  );
}
