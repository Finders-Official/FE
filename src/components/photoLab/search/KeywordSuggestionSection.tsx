import { SearchItem } from "@/components/common";

interface KeywordSuggestionSectionProps {
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
}

export default function KeywordSuggestionSection({
  keywords,
  onKeywordClick,
}: KeywordSuggestionSectionProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {keywords.map((keyword) => (
        <SearchItem
          key={keyword}
          type="search"
          text={keyword}
          onClick={() => onKeywordClick(keyword)}
        />
      ))}
    </div>
  );
}
