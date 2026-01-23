import type { RecentSearch } from "@/types/photoLabSearch";
import { SearchItem } from "@/components/common";
import { ChevronLeftIcon } from "@/assets/icon";

interface RecentSearchSectionProps {
  searches: RecentSearch[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onSearchClick: (keyword: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function RecentSearchSection({
  searches,
  isExpanded,
  onToggleExpand,
  onSearchClick,
  onDelete,
  onClearAll,
}: RecentSearchSectionProps) {
  if (searches.length === 0) return null;

  const visibleSearches = isExpanded ? searches : searches.slice(0, 5);
  const showExpandButton = searches.length > 5;

  return (
    <section className="flex flex-col gap-3">
      {/* 헤더 */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-100">
            최근 검색어
          </h2>
          <button
            type="button"
            onClick={onClearAll}
            className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400"
          >
            전체 삭제
          </button>
        </div>

        {/* 검색어 리스트 */}
        <div className="flex flex-col gap-4">
          {visibleSearches.map((search) => (
            <SearchItem
              key={search.id}
              type="recent"
              text={search.keyword}
              onClick={() => onSearchClick(search.keyword)}
              onDelete={() => onDelete(search.id)}
            />
          ))}
        </div>
      </div>

      {/* 펼쳐서 더보기 버튼 */}
      {showExpandButton && (
        <div className="flex items-center">
          <div className="h-px flex-1 bg-neutral-800" />
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center gap-0.5 rounded-[3.125rem] border border-neutral-800 px-4 py-2"
          >
            <span className="text-[0.875rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-300">
              {isExpanded ? "접기" : "펼쳐서 더보기"}
            </span>
            <ChevronLeftIcon
              className={`h-4 w-4 text-neutral-300 transition-transform ${
                isExpanded ? "rotate-90" : "-rotate-90"
              }`}
            />
          </button>
          <div className="h-px flex-1 bg-neutral-800" />
        </div>
      )}
    </section>
  );
}
