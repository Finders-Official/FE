import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { CTA_Button, SearchBar } from "@/components/common";
import { KeywordSuggestionSection } from "@/components/photoLab/search";
import { mockHistoryList } from "@/types/photoFeed/SearchHistory";
import { MOCK_KEYWORD_SUGGESTIONS } from "@/constants/photoLab";
import PhotoCard from "@/components/photoFeed/PhotoCard";
import { ChevronLeftIcon, FloatingIcon, LogoIcon } from "@/assets/icon";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import { mockPreviewList } from "@/types/photo";
import BottomSheet from "@/components/common/BottomSheet";
import SelectFilter, {
  type FilterKey,
} from "@/components/photoFeed/SelectFilter";
import { TabBar } from "@/components/common/TabBar";
import SearchPost from "@/components/photoFeed/SearchPost";

const FILTER_LABEL: Record<FilterKey, string> = {
  TITLE: "제목만",
  TITLE_CONTENT: "제목 + 본문",
  LAB_NAME: "현상소 이름",
  LAB_REVIEW: "현상소 리뷰 내용",
};

export default function PhotoFeedSearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterKey>("TITLE");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  // URL에서 검색어 가져오기 (results 상태 판단)
  const searchQuery = searchParams.get("keyword") || "";
  const isResultsState = !!searchQuery;

  const showTabBar = isResultsState && !bottomSheetOpen;

  const [searchText, setSearchText] = useState(""); // 입력 중인 검색어

  // SearchBar에 표시할 값 (results 상태에서는 URL 파라미터, 입력 상태에서는 local state)
  const displayQuery = isResultsState ? searchQuery : searchText;

  // 필터링 변경 핸들러
  const handleConfirm = () => {
    // 쿼리 파라미터 변경
  };

  // 검색어 변경 핸들러
  const handleQueryChange = (newQuery: string) => {
    setSearchText(newQuery);
    if (isResultsState && newQuery === "") {
      navigate("/photoFeed/search");
    }
  };

  // 자동완성 필터링
  const filteredKeywords = useMemo(() => {
    if (!searchText.trim()) return [];
    const q = searchText.toLowerCase();
    return MOCK_KEYWORD_SUGGESTIONS.filter((k) =>
      k.toLowerCase().includes(q),
    ).slice(0, 4);
  }, [searchText]);

  // 핸들러
  const handleBack = () => {
    navigate(-1);
  };

  // 검색 제출 시 replace로 입력화면을 history에서 제거
  const handleSearch = (searchValue: string) => {
    const trimmed = searchValue.trim();
    if (trimmed) {
      navigate(`/photoFeed/search?keyword=${encodeURIComponent(trimmed)}`, {
        replace: true,
      });
    }
  };

  const handleKeywordClick = (keyword: string) => {
    navigate(`/photoFeed/search?keyword=${encodeURIComponent(keyword)}`, {
      replace: true,
    });
  };

  const handleSearchBarClick = () => {
    if (isResultsState) {
      setSearchText(searchQuery);
      navigate("/photoFeed/search");
    }
  };

  return (
    <div className="relative min-h-dvh w-full flex-col">
      {/* SearchBar */}
      <div className="py-3">
        <SearchBar
          value={displayQuery}
          onChange={handleQueryChange}
          placeholder="게시글 제목, 본문, 현상소 이름 검색"
          showBack
          onBack={handleBack}
          onFocus={handleSearchBarClick}
          onSearch={handleSearch}
          rightIcon="clear"
        />
      </div>

      {/* 검색어 입력 전: 최근 검색어 출력 */}
      {!isResultsState && !searchText.trim() && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                최근 검색어
              </h2>
              <button
                type="button"
                onClick={() => {
                  // TODO: 최근 검색어 전체 삭제 API
                }}
                className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400"
              >
                전체 삭제
              </button>
            </div>

            {/* 검색어 리스트 */}
            <div className="flex flex-col gap-4">
              {mockHistoryList.historyList.map((search) => (
                <SearchPost
                  key={search.historyId}
                  image={search.imageUrl}
                  text={search.keyword}
                  onClick={() => handleKeywordClick(search.keyword)}
                  onDelete={() => {
                    // TODO: 해당 검색어 삭제 API
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 검색어 입력 중 */}
      {!isResultsState && searchText.trim() && (
        <div className="flex flex-col gap-[1.875rem] pt-5">
          <KeywordSuggestionSection
            keywords={filteredKeywords}
            onKeywordClick={handleKeywordClick}
          />
        </div>
      )}

      {/* 검색 결과가 없는 경우 */}
      {isResultsState && mockPreviewList.totalCount <= 0 && (
        <div className="pointer-events-none absolute inset-0 flex h-full flex-col items-center justify-center gap-4">
          <LogoIcon className="h-[94px] w-[94px]" />
          <div className="flex flex-col items-center justify-center">
            <p className="text-[16px] text-neutral-200">
              검색 결과가 없습니다.
            </p>
            <p className="text-[16px] text-neutral-200">
              다른 키워드로 검색해보세요.
            </p>
          </div>
        </div>
      )}

      {/* 검색 결과 출력 */}
      {isResultsState && mockPreviewList.totalCount > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                검색 결과
              </h2>
              <p className="text-[1rem] font-light text-neutral-100">
                {mockPreviewList.totalCount}개
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBottomSheetOpen(true);
              }}
              className="flex items-center gap-[6px] text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400"
            >
              <span>{FILTER_LABEL[filter]}</span>
              <ChevronLeftIcon className="h-4 w-4 rotate-[-90deg] text-neutral-200" />
            </button>
          </div>
          <section className="mb-25 columns-2 gap-4 md:columns-3 xl:columns-4">
            {mockPreviewList.previewList.map((photo) => (
              <PhotoCard key={photo.postId} photo={photo} />
            ))}
          </section>

          {/* 새 게시물 작성 플로팅 버튼 */}
          <button
            type="button"
            aria-label="새 게시물 작성"
            onClick={() => setIsCreateModalOpen(true)}
            className="fixed right-6 bottom-[calc(var(--tabbar-height)+var(--fab-gap))] z-50 flex h-[3.5625rem] w-[3.5625rem]"
          >
            <FloatingIcon className="h-[3.5625rem] w-[3.5625rem]" />
          </button>

          {isCreateModalOpen && (
            <NewPostModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
            />
          )}
        </div>
      )}
      {bottomSheetOpen && (
        <BottomSheet
          open={bottomSheetOpen}
          collapsedRatio={0.44}
          onClose={() => {
            setBottomSheetOpen(false);
          }}
          title="필터링 기준"
        >
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full">
              <SelectFilter value={filter} onChange={setFilter} />
            </div>
            <div className="fixed right-0 bottom-0 left-0 flex justify-center gap-3 px-5 py-5">
              <CTA_Button
                text="취소"
                size="medium"
                color="black"
                onClick={() => {
                  setBottomSheetOpen(false);
                }}
              />
              <CTA_Button
                text="확인"
                size="medium"
                color="orange"
                onClick={() => {
                  setBottomSheetOpen(false);
                  handleConfirm();
                }}
              />
            </div>
          </div>
        </BottomSheet>
      )}
      {showTabBar && <TabBar />}
    </div>
  );
}
