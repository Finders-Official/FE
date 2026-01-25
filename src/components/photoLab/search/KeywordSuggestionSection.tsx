import { SearchItem } from "@/components/common";

interface KeywordSuggestionSectionProps {
  keywords: string[];
  query: string;
  onKeywordClick: (keyword: string) => void;
}

export default function KeywordSuggestionSection({
  keywords,
  query,
  onKeywordClick,
}: KeywordSuggestionSectionProps) {
  if (keywords.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 border-b border-neutral-800 pb-5">
      {keywords.map((keyword) => (
        <SearchItem
          key={keyword}
          type="search"
          text={keyword}
          highlightText={query}
          onClick={() => onKeywordClick(keyword)}
        />
      ))}
    </div>
  );
}
