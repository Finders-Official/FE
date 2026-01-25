import { useState } from "react";
import SearchFilter from "@/components/photoFeed/SearchFilter";

export default function SelectFilter() {
  const [selectedFilter, setSelectedFilter] = useState(1);

  return (
    <div className="flex flex-col items-center gap-5 p-6">
      <div>
        <div>
          <SearchFilter
            text="제목만"
            isSelected={selectedFilter === 1}
            onClick={() => setSelectedFilter(1)}
          />
          <SearchFilter
            text="제목 + 본문"
            isSelected={selectedFilter === 2}
            onClick={() => setSelectedFilter(2)}
          />
          <SearchFilter
            text="현상소 이름"
            isSelected={selectedFilter === 3}
            onClick={() => setSelectedFilter(3)}
          />
          <SearchFilter
            text="현상소 리뷰 내용"
            isSelected={selectedFilter === 4}
            onClick={() => setSelectedFilter(4)}
          />
        </div>
      </div>
    </div>
  );
}
