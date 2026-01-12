import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header, FilterContainer } from "@/components/common";
import { LabNewsBanner, FilterTagList, LabList } from "@/components/photoLab";
import { SearchIcon } from "@/assets/icon";
import type { PhotoLabItem, FilterTag, LabNews } from "@/types/photoLab";
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
  const [filterValue] = useState<string | undefined>(undefined); // 바텀시트 연동 시 setFilterValue 사용. husky 우회용

  // 현상소 목록 상태
  const [labs, setLabs] = useState<PhotoLabItem[]>(mockLabs);

  // 필터링된 목록
  const filteredLabs =
    selectedTags.length > 0
      ? labs.filter((lab) =>
          selectedTags.some((tag) => lab.keywords.includes(tag)),
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
    // TODO: 검색 페이지로 이동
    console.log("Search clicked");
  };

  // 날짜/지역 필터 클릭
  const handleFilterClick = () => {
    // TODO: Bottom Sheet 열기
    console.log("Filter clicked");
  };

  return (
    <div className="flex w-full flex-col">
      {/* 헤더 */}
      <div className="px-4">
        <Header
          title="현상 맡기기"
          showBack={showBack}
          onBack={() => navigate(-1)}
          rightAction={{
            type: "icon",
            icon: <SearchIcon className="h-6 w-6 text-neutral-200" />,
            onClick: handleSearchClick,
          }}
        />
      </div>

      {/* 현상소 소식 배너 */}
      <div className="px-4 pb-4">
        <LabNewsBanner newsList={mockNews} />
      </div>

      {/* 필터 섹션 */}
      <div className="border-neutral-850 flex flex-col gap-4 border-b-[0.1875rem] px-4 pb-6">
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

      {/* 현상소 목록 */}
      <LabList
        labs={filteredLabs}
        onFavoriteToggle={handleFavoriteToggle}
        onCardClick={handleCardClick}
      />
    </div>
  );
}
