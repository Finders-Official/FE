import SearchFilterItem from "@/components/photoFeed/SearchFilterItem";
import type { Filter } from "@/types/photoFeed/postSearch";

const FILTER_OPTIONS: Array<{ key: Filter; label: string }> = [
  { key: "TITLE", label: "제목만" },
  { key: "TITLE_CONTENT", label: "제목 + 본문" },
  { key: "LAB_NAME", label: "현상소 이름" },
  { key: "LAB_REVIEW", label: "현상소 리뷰 내용" },
];

type SelectFilterProps = {
  value: Filter;
  onChange: (value: Filter) => void;
};

export default function SelectFilter({ value, onChange }: SelectFilterProps) {
  return (
    <div
      className="flex w-full flex-col gap-5 p-6"
      role="radiogroup"
      aria-label="필터링 기준"
    >
      {FILTER_OPTIONS.map((opt) => (
        <SearchFilterItem
          key={opt.key}
          text={opt.label}
          selected={value === opt.key}
          onSelect={() => onChange(opt.key)}
        />
      ))}
    </div>
  );
}
