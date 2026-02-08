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
  useAutocomplete,
  useSearchPreview,
} from "@/hooks/photoLab";
import { displayTimesToApiTimes } from "@/utils/time";
import { WEEKDAYS } from "@/constants/date";
import { SEARCH_DEBOUNCE_MS } from "@/constants/photoLab";
import { usePhotoLabFilter } from "@/store/usePhotoLabFilter.store";

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

  // 필터 상태 (목록 페이지와 공유)
  const { filter, setFilter, selectedTagIds, setSelectedTagIds } =
    usePhotoLabFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 키워드 자동완성
  const { data: filteredKeywords = [] } = useAutocomplete(query);

  // 검색 미리보기 (경량 API)
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);
  const { data: filteredLabPreviews = [] } = useSearchPreview(
    {
      q: debouncedQuery,
      lat: latitude ?? undefined,
      lng: longitude ?? undefined,
    },
    !isResultsState,
  );

  // 검색 결과 API 연동
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePhotoLabList(
      {
        q: searchQuery || undefined,
        tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        regionIds: filter.regionIds,
        date: filter.date,
        time:
          filter.time && filter.time.length > 0
            ? displayTimesToApiTimes(filter.time)
            : undefined,
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
    if (filter.regionSelections && filter.regionSelections.length > 0) {
      const first = filter.regionSelections[0];
      const firstLabel =
        first.subRegion === "전체"
          ? `${first.parentName} 전체`
          : `${first.parentName} ${first.subRegion}`;
      if (filter.regionSelections.length === 1) {
        parts.push(firstLabel);
      } else {
        parts.push(`${firstLabel} 외 ${filter.regionSelections.length - 1}개`);
      }
    }
    return parts.length > 0 ? parts.join(" • ") : undefined;
  };

  // 뒤로가기: 검색 결과 → 검색 입력, 검색 입력 → 현상소 목록
  const handleBack = () => {
    if (isResultsState) {
      navigate("/photolab/search", { replace: true });
    } else {
      navigate("/photolab", { replace: true });
    }
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
