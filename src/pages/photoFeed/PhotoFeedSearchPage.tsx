import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { CTA_Button, SearchBar } from "@/components/common";
import PhotoCard from "@/components/photoFeed/PhotoCard";
import { ChevronLeftIcon, FloatingIcon, LogoIcon } from "@/assets/icon";
import NewPostModal from "@/components/photoFeed/NewPostModal";
import BottomSheet from "@/components/common/BottomSheet";
import SelectFilter from "@/components/photoFeed/SelectFilter";
import { TabBar } from "@/components/common/TabBar";
import SearchPost from "@/components/photoFeed/SearchPost";
import { useRecentSearches } from "@/hooks/photoFeed/search/useRecentSearches";
import type { Filter } from "@/types/photoFeed/postSearch";
import { useRelatedSearches } from "@/hooks/photoFeed/search/useRelatedSearches";
import { KeywordSuggestionSection } from "@/components/photoLab/search";
import { useSearchPosts } from "@/hooks/photoFeed/search/useSearchPosts";
import { useDeleteRecentSearch } from "@/hooks/photoFeed/search/useDeleteRecentSearch";
import { useDeleteRecentSearchesAll } from "@/hooks/photoFeed/search/useDeleteRecentSearchesAll";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import SearchItemSkeleton from "@/components/photoFeed/SearchItemSkeleton";
import PhotoCardSkeleton from "@/components/photoFeed/PhotoCardSkeleton";
import SearchPostSkeleton from "@/components/photoFeed/SearchPostSkeleton";

const FILTER_LABEL: Record<Filter, string> = {
  TITLE: "제목만",
  TITLE_CONTENT: "제목 + 본문",
  LAB_NAME: "현상소 이름",
  LAB_REVIEW: "현상소 리뷰 내용",
};

const SKELETON_COUNT = 8;

const SKELETON_HEIGHTS = [
  "h-[180px]",
  "h-[220px]",
  "h-[260px]",
  "h-[300px]",
  "h-[340px]",
];

export default function PhotoFeedSearchPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("TITLE");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const [inputText, setInputText] = useState(""); // 입력 중
  const [searchText, setSearchText] = useState(""); // 제출된 검색어
  const [isSearching, setIsSearching] = useState(false); // input focus 상태

  const inputTrimmed = inputText.trim();
  const searchTrimmed = searchText.trim();

  // 최근 검색어 조회 API
  const {
    data: recentSearches = [],
    isPending: isRecentPending,
    isError: isRecentError,
  } = useRecentSearches();

  // 최근 검색어 개별 삭제 API
  const { mutate: deleteRecent, isPending: isDeletingOne } =
    useDeleteRecentSearch();

  // 최근 검색어 전체 삭제 API
  const { mutate: deleteRecentAll, isPending: isDeletingAll } =
    useDeleteRecentSearchesAll();

  // 연관 검색어 조회 API
  const {
    data: relatedSearches,
    isFetching: isRelatedPending,
    isError: isRelatedError,
  } = useRelatedSearches(inputText);

  // 검색 결과 조회 API
  const {
    data: searchData,
    fetchNextPage,
    isPending: isSearchPending,
    isError: isSearchError,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchPosts({ keyword: searchText, filter: filter, sort: "DESC" });

  const previewList = searchData?.pages.flatMap((p) => p.previewList) ?? [];
  const totalCount = searchData?.pages[0]?.totalCount ?? 0;

  /** 화면 모드: 최근/연관/결과 */
  const mode = useMemo(() => {
    // input이 비어있고 focus도 아니면 최근검색어
    if (!inputTrimmed && !isSearching) return "recent" as const;
    // focus 중이고 아직 검색 제출 전이면 연관검색어
    if (isSearching && !searchTrimmed) return "related" as const;
    // 검색어가 제출되어 있으면 결과
    if (searchTrimmed) return "result" as const;
    // 그 외(예: focus만 껐다 켰다) -> 최근으로 처리
    return "recent" as const;
  }, [inputTrimmed, isSearching, searchTrimmed]);

  const showTabBar = mode === "result" && !bottomSheetOpen;

  // 검색어 변경 핸들러
  const handleQueryChange = (value: string) => {
    setInputText(value);
    if (value === "") {
      setSearchText("");
      setInputText("");
      setIsSearching(false);
    }
  };

  // 검색 제출 핸들러
  const handleSearch = (value: string) => {
    const v = value.trim();
    setSearchText(v);
    setInputText(v);
    setIsSearching(false);
  };

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  useInfiniteScroll({
    target: sentinelRef,
    enabled: mode === "result" && hasNextPage && !isFetchingNextPage,
    onIntersect: onIntersect,
  });

  return (
    <div className="relative min-h-dvh w-full flex-col">
      {/* SearchBar */}
      <div className="py-3">
        <SearchBar
          value={inputText}
          onChange={handleQueryChange}
          placeholder="게시글 제목, 본문, 현상소 이름 검색"
          showBack
          onBack={() => navigate(-1)}
          onSearch={handleSearch}
          onFocus={() => setIsSearching(true)}
          rightIcon="clear"
        />
      </div>

      {/* 최근 검색어 */}
      {mode === "recent" && (
        <>
          {/* 최근 검색어 로딩중 */}
          {isRecentPending ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SearchPostSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* 최근 검색어 로딩 실패 */}
              {isRecentError ? (
                <div className="flex items-center justify-center py-6 text-red-400">
                  최근 검색어 불러오기에 실패했어요.
                </div>
              ) : (
                <>
                  {recentSearches.length === 0 ? (
                    <>
                      {/* 최근 검색어 없음 */}
                      <div className="pointer-events-none absolute inset-0 flex h-full flex-col items-center justify-center gap-4">
                        <LogoIcon className="h-[94px] w-[94px]" />
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-[16px] text-neutral-200">
                            최근 검색 결과가 없습니다.
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                            최근 검색어
                          </h2>
                          <button
                            type="button"
                            onClick={() => deleteRecentAll()}
                            disabled={isDeletingAll}
                            className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400"
                          >
                            전체 삭제
                          </button>
                        </div>

                        {/* 최근 검색어 리스트 */}
                        <div className="flex flex-col gap-4">
                          {recentSearches.map((search) => (
                            <SearchPost
                              key={search.id}
                              historyId={search.id}
                              image={search.imageUrl}
                              text={search.keyword}
                              onClick={() => handleSearch(search.keyword)}
                              onDelete={(id) => {
                                if (isDeletingOne) return;
                                deleteRecent(id);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* 연관 검색어 */}
      {mode === "related" && (
        <>
          {/* 연관 검색어 로딩중 */}
          {isRelatedPending ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                <SearchItemSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {/* 연관 검색어 로딩 실패 */}
              {isRelatedError ? (
                <div className="flex items-center justify-center py-6 text-red-400">
                  연관 검색어 불러오기에 실패했어요.
                </div>
              ) : (
                <>
                  {/* 연관 검색어 리스트 */}
                  {relatedSearches && relatedSearches.length > 0 && (
                    <div className="flex flex-col gap-[1.875rem] pt-5">
                      <KeywordSuggestionSection
                        keywords={relatedSearches}
                        onKeywordClick={handleSearch}
                      />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/* 검색 결과 */}
      {mode === "result" && (
        <>
          {isSearchPending ? (
            <>
              {/* 검색 결과 로딩중 */}
              <section className="mb-20 columns-2 gap-4 md:columns-3 xl:columns-4">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => {
                  const heightClass =
                    SKELETON_HEIGHTS[i % SKELETON_HEIGHTS.length];

                  return (
                    <PhotoCardSkeleton
                      key={`skeleton-${i}`}
                      className={heightClass}
                    />
                  );
                })}
              </section>
            </>
          ) : (
            <>
              {isSearchError ? (
                <>
                  {/* 검색 결과 로딩 실패 */}
                  <div className="flex items-center justify-center py-6 text-red-400">
                    검색 결과 불러오기에 실패했어요.
                  </div>
                </>
              ) : (
                <>
                  {previewList.length > 0 ? (
                    <>
                      {/* 검색 결과 존재 */}
                      <div className="mt-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
                              검색 결과
                            </h2>
                            <p className="text-[1rem] font-light text-neutral-100">
                              {totalCount}개
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
                          {previewList.map((photo) => (
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
                    </>
                  ) : (
                    <>
                      {/* 검색 결과 없음 */}
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
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}

      {/** 정렬 기준 선택 바텀시트 */}
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
                }}
              />
            </div>
          </div>
        </BottomSheet>
      )}

      {/* 센티널 요소 */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/** 탭바 표시 */}
      {showTabBar && <TabBar />}
    </div>
  );
}
