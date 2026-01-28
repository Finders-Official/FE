import { useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header, FilterContainer } from "@/components/common";
import {
  LabNewsBanner,
  FilterTagList,
  LabList,
  FilterBottomSheet,
} from "@/components/photoLab";
import { SearchIcon } from "@/assets/icon";
import { WEEKDAYS } from "@/constants/date";
import {
  useGeolocation,
  usePhotoLabList,
  useFavoriteToggle,
} from "@/hooks/photoLab";
import type { LabNews, FilterState } from "@/types/photoLab";

// Mock 데이터 (추후 API 연동)
const mockNews: LabNews[] = [
  {
    id: 1,
    type: "공지",
    labName: "파인더스 동작점",
    content: "택배 접수 시작합니다",
  },
  {
    id: 2,
    type: "이벤트",
    labName: "파인더스 홍대점",
    content: "첫 방문 고객 대상 500원 할인",
  },
];

export default function PhotoLabPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 뒤로가기 버튼 표시 여부
  const showBack = !!location.state?.from || window.history.length > 2;

  // TODO: FilterBottomSheet API 연동 (regionId, date 매핑)
  // 필터 상태
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({});

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
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        regionId: filter.regionId,
        date: filter.date,
        lat: latitude ?? undefined,
        lng: longitude ?? undefined,
      },
      !isLocationLoading,
    );

  // 페이지 데이터 평탄화
  const labs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  // 필터 값 표시 문자열 계산
  const formatFilterValue = (): string | undefined => {
    const parts: string[] = [];

    if (filter.date) {
      const date = new Date(filter.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = WEEKDAYS[date.getDay()];
      parts.push(`${month}.${day}(${weekday})`);
    }

    if (filter.region) {
      const regionText = filter.subRegion
        ? `${filter.region} ${filter.subRegion}`
        : filter.region;
      parts.push(regionText);
    }

    return parts.length > 0 ? parts.join(" • ") : undefined;
  };

  const filterValue = formatFilterValue();

  // 태그 토글
  const handleTagToggle = useCallback((tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  }, []);

  // 즐겨찾기 토글
  const { mutate: toggleFavorite } = useFavoriteToggle();

  const handleFavoriteToggle = useCallback(
    (photoLabId: number, isFavorite: boolean) => {
      toggleFavorite({ photoLabId, isFavorite });
    },
    [toggleFavorite],
  );

  // 카드 클릭
  const handleCardClick = (photoLabId: number) => {
    navigate(`/photolab/${photoLabId}`);
  };

  // 검색 클릭
  const handleSearchClick = () => {
    navigate("/photolab/search");
  };

  // 날짜/지역 필터 클릭
  const handleFilterClick = () => {
    setIsFilterOpen(true);
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
      {/* 헤더 */}
      <Header
        title="현상 맡기기"
        showBack={showBack}
        onBack={() => navigate(-1)}
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: handleSearchClick,
        }}
      />

      {/* 현상소 소식 배너 */}
      <div className="pb-4">
        <LabNewsBanner newsList={mockNews} />
      </div>

      {/* 필터 섹션 - 스크롤 시 상단 고정 */}
      <div className="sticky top-0 z-20 -mx-4 bg-neutral-900 px-4">
        <div className="flex flex-col gap-4 pb-6">
          <FilterContainer
            label="날짜 / 지역"
            value={filterValue}
            onClick={handleFilterClick}
          />
          <FilterTagList
            selectedTagIds={selectedTagIds}
            onTagToggle={handleTagToggle}
          />
        </div>
        {/* 구분선 */}
        <div className="bg-neutral-850 -mx-4 h-[0.1875rem]" />
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
        emptyMessage={
          selectedTagIds.length > 0
            ? "검색 조건에 맞는 현상소가 없어요"
            : "아직 현상소가 없어요"
        }
        className="pb-(--tabbar-height)"
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
