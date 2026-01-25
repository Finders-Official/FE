import type { RecentSearch } from "@/types/photoLabSearch";
import SearchPost from "./SearchPost";
import mock1 from "@/assets/mocks/mock1.jpg";

interface RecentSearchProps {
  searches: RecentSearch[];
  onSearchClick: (keyword: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export default function RecentSearchKeyword({
  searches,
  onSearchClick,
  onDelete,
  onClearAll,
}: RecentSearchProps) {
  if (searches.length === 0) return null;

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
          {searches.map((search) => (
            <SearchPost
              key={search.id}
              image={mock1}
              text={search.keyword}
              onClick={() => onSearchClick(search.keyword)}
              onDelete={() => onDelete(search.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
