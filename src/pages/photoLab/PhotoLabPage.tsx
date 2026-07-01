import { useState, useMemo, useCallback } from "react";
import { usePhotoLabFilter } from "@/store/usePhotoLabFilter.store";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import { LabList, FilterBottomSheet } from "@/components/photoLab";
import { SearchIcon, FilterIcon } from "@/assets/icon";
import {
  useGeolocation,
  usePhotoLabList,
  useFavoriteToggle,
} from "@/hooks/photoLab";
import type { FilterState } from "@/types/photoLab";

export default function PhotoLabPage() {
  const navigate = useNavigate();
  // const location = useLocation();

  // 메인 페이지 "현상 맡기기" 버튼을 통한 진입여부
  // const isFromMain = location.state?.from === "main";

  // 필터 상태 (검색 페이지와 공유)
  const { filter, setFilter } = usePhotoLabFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 위치 정보
  const {
    latitude,
    longitude,
    isLoading: isLocationLoading,
  } = useGeolocation();

  // 현상소 목록 조회
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotoLabList(
      {
        regionIds: filter.regionIds,
        lat: latitude ?? undefined,
        lng: longitude ?? undefined,
      },
      !isLocationLoading,
    );

  // 페이지 데이터 평탄화
  const labs = useMemo(() => {
    const flat = data?.pages.flatMap((page) => page.data) ?? [];
    return [...flat].sort((a, b) => b.favoriteCount - a.favoriteCount);
  }, [data]);

  // 즐겨찾기 토글
  const { mutate: toggleFavorite } = useFavoriteToggle();

  const handleFavoriteToggle = useCallback(
    (photoLabId: string, isFavorite: boolean) => {
      toggleFavorite({ photoLabId, isFavorite });
    },
    [toggleFavorite],
  );

  // 카드 클릭
  const handleCardClick = (photoLabId: string) => {
    navigate(`/photolab/${photoLabId}`);
  };

  // 검색 클릭
  const handleSearchClick = () => {
    navigate("/photolab/search");
  };

  // 필터 적용
  const handleFilterApply = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  // 무한스크롤
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex w-full flex-col">
      {/* 헤더 (스크롤 시에도 상단 고정) */}
      <div className="sticky top-0 z-20 -mx-4 -mt-[env(safe-area-inset-top)] bg-neutral-900 px-4 pt-[env(safe-area-inset-top)]">
        <Header
          title={"현상소 보기"}
          showBack={false}
          leftAction={{
            type: "icon",
            icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
            onClick: handleSearchClick,
          }}
          rightAction={{
            type: "icon",
            icon: <FilterIcon className="h-6 w-6 text-neutral-200" />,
            onClick: () => setIsFilterOpen(true),
          }}
        />
      </div>

      {/* 현상소 목록 */}
      <LabList
        labs={labs}
        isLoading={isLoading || isLocationLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage ?? false}
        onLoadMore={handleLoadMore}
        onFavoriteToggle={handleFavoriteToggle}
        onCardClick={handleCardClick}
        emptyMessage="아직 현상소가 없어요"
        className="pt-4 pb-(--tabbar-height)"
      />

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilter={filter}
        onApply={handleFilterApply}
      />
    </div>
  );
}
