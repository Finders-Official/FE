import { PHOTO_LAB_TAGS } from "@/constants/photoLab";
import { FilterChip } from "@/components/common";

interface FilterTagListProps {
  selectedTagIds: number[];
  onTagToggle: (tagId: number) => void;
  className?: string;
}

export default function FilterTagList({
  selectedTagIds,
  onTagToggle,
  className = "",
}: FilterTagListProps) {
  return (
    <div
      className={`scrollbar-hide scroll-fade-right flex gap-2 overflow-x-auto ${className}`}
    >
      {PHOTO_LAB_TAGS.map((tag) => (
        <FilterChip
          key={tag.id}
          label={tag.name}
          selected={selectedTagIds.includes(tag.id)}
          onClick={() => onTagToggle(tag.id)}
        />
      ))}
    </div>
  );
}

export type { FilterTagListProps };
