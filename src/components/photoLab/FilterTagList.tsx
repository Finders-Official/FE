import type { FilterTag } from "@/types/photoLab";
import { FilterChip } from "@/components/common";

const FILTER_TAGS: FilterTag[] = [
  "따뜻한 색감",
  "청량한",
  "빈티지한",
  "영화용 필름",
  "택배 접수",
];

interface FilterTagListProps {
  selectedTags: FilterTag[];
  onTagToggle: (tag: FilterTag) => void;
  className?: string;
}

export default function FilterTagList({
  selectedTags,
  onTagToggle,
  className = "",
}: FilterTagListProps) {
  return (
    <div
      className={`scrollbar-hide -mr-4 flex gap-2 overflow-x-auto pr-4 ${className}`}
    >
      {FILTER_TAGS.map((tag) => (
        <FilterChip
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onClick={() => onTagToggle(tag)}
        />
      ))}
    </div>
  );
}

export type { FilterTagListProps };
