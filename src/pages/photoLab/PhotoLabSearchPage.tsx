import { useState, useMemo } from "react";
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
import { useRecentSearches } from "@/hooks/useRecentSearches";
import {
  MOCK_POPULAR_LABS,
  MOCK_KEYWORD_SUGGESTIONS,
  MOCK_LAB_PREVIEWS,
} from "@/constants/photoLab";
import { WEEKDAYS } from "@/constants/date";
import type { PhotoLabItem, FilterTag, FilterState } from "@/types/photoLab";
import PLmock from "@/assets/mocks/PLmock.png";

// 검색 결과용 mock 데이터
const mockSearchResults: PhotoLabItem[] = [
  {
    photoLabId: 1,
    name: "초보자를 위한 현상소 상도점",
    keywords: ["따뜻한 색감", "빈티지한", "택배 접수"],
    address: "서울 동작구 상도 1동 OOO",
    distanceKm: 1.5,
    workCount: 52,
    avgWorkTimeMinutes: 30,
    imageUrls: [PLmock, PLmock],
    isFavorite: false,
  },
  {
    photoLabId: 2,
    name: "초보자를 위한 현상소 흑석점",
    keywords: ["청량한", "영화용 필름"],
    address: "서울 동작구 흑석동 OOO",
    distanceKm: 3.2,
    workCount: 128,
    avgWorkTimeMinutes: 45,
    imageUrls: [PLmock, PLmock],
    isFavorite: true,
  },
];

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

  // 최근 검색어
  const { recentSearches, addSearch, removeSearch, clearAll } =
    useRecentSearches();
  const [isRecentExpanded, setIsRecentExpanded] = useState(false);

  // 필터 상태 (results 화면용)
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({});

  // 검색 결과
  const [labs, setLabs] = useState<PhotoLabItem[]>(mockSearchResults);

  // 자동완성 필터링
  const filteredKeywords = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_KEYWORD_SUGGESTIONS.filter((k) =>
      k.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [query]);

  const filteredLabPreviews = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return MOCK_LAB_PREVIEWS.filter(
      (lab) =>
        lab.name.toLowerCase().includes(q) ||
        lab.address.toLowerCase().includes(q),
    ).slice(0, 10);
  }, [query]);

  // 검색 결과 필터링
  const filteredLabs = useMemo(() => {
    let result = labs;
    if (selectedTags.length > 0) {
      result = result.filter((lab) =>
        selectedTags.every((tag) => lab.keywords.includes(tag)),
      );
    }
    return result;
  }, [labs, selectedTags]);

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

  const handleFavoriteToggle = (photoLabId: number) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.photoLabId === photoLabId
          ? { ...lab, isFavorite: !lab.isFavorite }
          : lab,
      ),
    );
  };

  const handleTagToggle = (tag: FilterTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
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
          <PopularLabSection
            labs={MOCK_POPULAR_LABS}
            onLabClick={handleLabClick}
          />
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
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
              />
            </div>
            <div className="bg-neutral-850 -mx-4 h-[0.1875rem]" />
          </div>

          {/* 검색 결과 목록 */}
          <LabList
            labs={filteredLabs}
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
