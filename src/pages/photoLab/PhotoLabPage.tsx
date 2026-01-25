import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header, FilterContainer } from "@/components/common";
import {
  LabNewsBanner,
  FilterTagList,
  LabList,
  FilterBottomSheet,
} from "@/components/photoLab";
import { SearchIcon } from "@/assets/icon";
import { WEEKDAYS } from "@/constants/date";
import type {
  PhotoLabItem,
  FilterTag,
  LabNews,
  FilterState,
} from "@/types/photoLab";
import PLmock from "@/assets/mocks/PLmock.png";

// Mock 데이터 (추후 API 연동)
const mockNews: LabNews[] = [
  {
    id: 1,
    type: "공지",
    labName: "파인더스 동작점",
    content: "택배 접수 시작합니다",
  },
  {
    id: 2,
    type: "이벤트",
    labName: "파인더스 홍대점",
    content: "첫 방문 고객 대상 500원 할인",
  },
];

const mockLabs: PhotoLabItem[] = [
  {
    photoLabId: 1,
    name: "파인더스 현상소 상도점",
    keywords: ["따뜻한 색감", "빈티지한", "택배 접수"],
    address: "서울 동작구 상도 1동 OOO",
    distanceKm: 1.5,
    workCount: 52,
    avgWorkTimeMinutes: 30,
    imageUrls: [PLmock, PLmock],
    isFavorite: false,
  },
  {
    photoLabId: 2,
    name: "파인더스 현상소 흑석점",
    keywords: ["청량한", "영화용 필름"],
    address: "서울 동작구 흑석동 OOO",
    distanceKm: 3.2,
    workCount: 128,
    avgWorkTimeMinutes: 45,
    imageUrls: [PLmock, PLmock],
    isFavorite: true,
  },
  {
    photoLabId: 3,
    name: "파인더스 현상소 홍대점",
    keywords: ["따뜻한 색감", "영화용 필름", "택배 접수"],
    address: "서울 마포구 서교동 OOO",
    distanceKm: 5.1,
    workCount: 203,
    avgWorkTimeMinutes: 60,
    imageUrls: [PLmock],
    isFavorite: false,
  },
];

export default function PhotoLabPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 뒤로가기 버튼 표시 여부
  const showBack = !!location.state?.from || window.history.length > 2;

  // 필터 상태
  const [selectedTags, setSelectedTags] = useState<FilterTag[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({});

  // 필터 값 표시 문자열 계산
  const formatFilterValue = (): string | undefined => {
    const parts: string[] = [];

    if (filter.date) {
      const date = new Date(filter.date);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = WEEKDAYS[date.getDay()];
      parts.push(`${month}.${day}(${weekday})`);
    }

    if (filter.region) {
      const regionText = filter.subRegion
        ? `${filter.region} ${filter.subRegion}`
        : filter.region;
      parts.push(regionText);
    }

    return parts.length > 0 ? parts.join(" • ") : undefined;
  };

  const filterValue = formatFilterValue();

  // 현상소 목록 상태
  const [labs, setLabs] = useState<PhotoLabItem[]>(mockLabs);

  // 필터링된 목록 (AND 조건: 선택한 모든 태그를 포함해야 하도록)
  const filteredLabs =
    selectedTags.length > 0
      ? labs.filter((lab) =>
          selectedTags.every((tag) => lab.keywords.includes(tag)),
        )
      : labs;

  // 태그 토글
  const handleTagToggle = (tag: FilterTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  // 즐겨찾기 토글
  const handleFavoriteToggle = (photoLabId: number) => {
    setLabs((prev) =>
      prev.map((lab) =>
        lab.photoLabId === photoLabId
          ? { ...lab, isFavorite: !lab.isFavorite }
          : lab,
      ),
    );
  };

  // 카드 클릭
  const handleCardClick = (photoLabId: number) => {
    navigate(`/photolab/${photoLabId}`);
  };

  // 검색 클릭
  const handleSearchClick = () => {
    navigate("/photolab/search");
  };

  // 날짜/지역 필터 클릭
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  // 필터 적용
  const handleFilterApply = (newFilter: FilterState) => {
    setFilter(newFilter);
  };

  return (
    <div className="flex w-full flex-col">
      {/* 헤더 */}
      <Header
        title="현상 맡기기"
        showBack={showBack}
        onBack={() => navigate(-1)}
        rightAction={{
          type: "icon",
          icon: <SearchIcon className="h-4.5 w-4.5 text-neutral-200" />,
          onClick: handleSearchClick,
        }}
      />

      {/* 현상소 소식 배너 */}
      <div className="pb-4">
        <LabNewsBanner newsList={mockNews} />
      </div>

      {/* 필터 섹션 - 스크롤 시 상단 고정 */}
      <div className="sticky top-0 z-20 -mx-4 bg-neutral-900 px-4">
        <div className="flex flex-col gap-4 pb-6">
          <FilterContainer
            label="날짜 / 지역"
            value={filterValue}
            onClick={handleFilterClick}
          />
          <FilterTagList
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </div>
        {/* 구분선 */}
        <div className="bg-neutral-850 -mx-4 h-[0.1875rem]" />
      </div>

      {/* 현상소 목록 */}
      <LabList
        labs={filteredLabs}
        onFavoriteToggle={handleFavoriteToggle}
        onCardClick={handleCardClick}
        emptyMessage={
          selectedTags.length > 0
            ? "검색 조건에 맞는 현상소가 없어요"
            : "아직 현상소가 없어요" //말투는 추후 확인 필요
        }
        className="pt-4 pb-(--tabbar-height)"
      />

      {/* 필터 바텀시트 */}
      <FilterBottomSheet
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        initialFilter={filter}
        onApply={handleFilterApply}
      />
    </div>
  );
}
