import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { SearchBar, FilterContainer } from "@/components/common";
import {
  FilterTagList,
  LabList,
  FilterBottomSheet,
} from "@/components/photoLab";
import {
  PopularLabSection,
  RecentSearchSection,
  KeywordSuggestionSection,
  LabPreviewSection,
} from "@/components/photoLab/search";
import { useRecentSearches } from "@/hooks/common/useRecentSearches";
import { useDebouncedValue } from "@/hooks/common";
import {
  usePopularPhotoLabs,
  usePhotoLabList,
  useFavoriteToggle,
  useGeolocation,
} from "@/hooks/photoLab";
import { getPhotoLabList } from "@/apis/photoLab";
import { useQuery } from "@tanstack/react-query";
import { MOCK_KEYWORD_SUGGESTIONS } from "@/constants/photoLab";
import { WEEKDAYS } from "@/constants/date";
import type { FilterState } from "@/types/photoLab";
import type { LabPreview } from "@/types/photoLabSearch";

export default function PhotoLabSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL에서 검색어 가져오기 (results 상태 판단)
  const searchQuery = searchParams.get("q") || "";
  const isResultsState = !!searchQuery;

  // 입력 중인 검색어 (PL-011-1, PL-011-2용)
  const [query, setQuery] = useState("");

  // SearchBar에 표시할 값 (results 상태에서는 URL 파라미터, 입력 상태에서는 local state)
  const displayQuery = isResultsState ? searchQuery : query;

  // 검색어 변경 핸들러
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    if (isResultsState && newQuery === "") {
      navigate("/photolab/search");
    }
  };

  // 위치 정보
  const {
    latitude,
    longitude,
    isLoading: isLocationLoading,
  } = useGeolocation();

  // 인기 현상소
  const { data: popularLabs = [] } = usePopularPhotoLabs();

  // 최근 검색어
  const { recentSearches, addSearch, removeSearch, clearAll } =
    useRecentSearches();
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);

  // 필터 상태 (results 화면용)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({});

  // TODO: 키워드 자동완성 API 연동 (백엔드 개발중)
  const filteredKeywords = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_KEYWORD_SUGGESTIONS.filter((k) =>
      k.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [query]);

  // TODO: 백엔드 경량 API 완성 시 교체
  const debouncedQuery = useDebouncedValue(query, 300);
  const { data: previewData } = useQuery({
    queryKey: ["photoLab", "preview", debouncedQuery],
    queryFn: () =>
      getPhotoLabList({
        q: debouncedQuery,
        size: 10,
        lat: latitude ?? undefined,
        lng: longitude ?? undefined,
      }),
    enabled: !!debouncedQuery.trim() && !isResultsState,
    staleTime: 1000 * 60 * 2,
  });

  const filteredLabPreviews: LabPreview[] = useMemo(() => {
    if (!previewData?.data) return [];
    return previewData.data.map((lab) => ({
      photoLabId: lab.photoLabId,
      name: lab.name,
      address: lab.address,
      distanceKm: lab.distanceKm,
      mainImageUrl: lab.imageUrls[0] ?? null,
    }));
  }, [previewData]);

  // 검색 결과 API 연동
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotoLabList(
      {
        q: searchQuery || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        regionId: filter.regionId,
        date: filter.date,
        lat: latitude ?? undefined,
        lng: longitude ?? undefined,
      },
      isResultsState && !isLocationLoading,
    );

  const labs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  // 즐겨찾기 토글
  const { mutate: toggleFavorite } = useFavoriteToggle();

  const handleFavoriteToggle = useCallback(
    (photoLabId: number, isFavorite: boolean) => {
      toggleFavorite({ photoLabId, isFavorite });
    },
    [toggleFavorite],
  );

  // 무한스크롤
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 필터 값 포맷
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

  // 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 검색 제출 시 replace로 입력화면을 history에서 제거
  const handleSearch = (searchValue: string) => {
    const trimmed = searchValue.trim();
    if (trimmed) {
      addSearch(trimmed);
      navigate(`/photolab/search?q=${encodeURIComponent(trimmed)}`, {
        replace: true,
      });
    }
  };

  const handleRecentSearchClick = (keyword: string) => {
    addSearch(keyword);
    navigate(`/photolab/search?q=${encodeURIComponent(keyword)}`, {
      replace: true,
    });
  };

  const handleKeywordClick = (keyword: string) => {
    addSearch(keyword);
    navigate(`/photolab/search?q=${encodeURIComponent(keyword)}`, {
      replace: true,
    });
  };

  const handleSearchBarClick = () => {
    if (isResultsState) {
      setQuery(searchQuery);
      navigate("/photolab/search");
    }
  };

  const handleLabClick = (photoLabId: number) => {
    navigate(`/photolab/${photoLabId}`);
  };

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  return (
    <div className="flex w-full flex-col">
      {/* SearchBar */}
      <div className="py-3">
        <SearchBar
          value={displayQuery}
          onChange={handleQueryChange}
          placeholder="어떤 현상소를 찾으시나요?"
          showBack
          onBack={handleBack}
          onFocus={handleSearchBarClick}
          onSearch={handleSearch}
          rightIcon="clear"
        />
      </div>

      {/* PL-011-1: 검색어 입력 전 */}
      {!isResultsState && !query.trim() && (
        <div className="flex flex-col gap-8 pt-4">
          <RecentSearchSection
            searches={recentSearches}
            isExpanded={isRecentExpanded}
            onToggleExpand={() => setIsRecentExpanded((prev) => !prev)}
            onSearchClick={handleRecentSearchClick}
            onDelete={removeSearch}
            onClearAll={clearAll}
          />
          <PopularLabSection labs={popularLabs} onLabClick={handleLabClick} />
        </div>
      )}

      {/* PL-011-2: 검색어 입력 중 */}
      {!isResultsState && query.trim() && (
        <div className="flex flex-col gap-[1.875rem] pt-5">
          <KeywordSuggestionSection
            keywords={filteredKeywords}
            query={query}
            onKeywordClick={handleKeywordClick}
          />
          <LabPreviewSection
            labs={filteredLabPreviews}
            onLabClick={handleLabClick}
          />
        </div>
      )}

      {/* PL-011-3: 검색 결과 */}
      {isResultsState && (
        <>
          {/* 필터 섹션 */}
          <div className="sticky top-0 z-10 bg-neutral-900">
            <div className="flex flex-col gap-4 pb-6">
              <FilterContainer
                label="날짜 / 지역"
                value={formatFilterValue()}
                onClick={() => setIsFilterOpen(true)}
              />
              <FilterTagList
                selectedTagIds={selectedTagIds}
                onTagToggle={handleTagToggle}
              />
            </div>
            <div className="bg-neutral-850 -mx-4 h-[0.1875rem]" />
          </div>

          {/* 검색 결과 목록 */}
          <LabList
            labs={labs}
            isLoading={isLoading || isLocationLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage ?? false}
            onLoadMore={handleLoadMore}
            onFavoriteToggle={handleFavoriteToggle}
            onCardClick={handleLabClick}
            emptyMessage="검색 결과가 없어요"
            className="pt-4"
          />

          {/* 필터 바텀시트 */}
          <FilterBottomSheet
            open={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            initialFilter={filter}
            onApply={setFilter}
          />
        </>
      )}
    </div>
  );
}
