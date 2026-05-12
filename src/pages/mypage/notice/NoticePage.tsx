import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyOrderState } from "@/components/mypage";
import { NoticeListItem } from "@/components/mypage/notice/NoticeListItem";
import { TabNavigation } from "@/components/mypage/notice/TabNavigaton";
import type { NoticeItem, NoticeType, TabName } from "@/types/mypage/notice";
import { useCallback, useEffect, useState } from "react";

const MOCK_DATA: Record<NoticeType, NoticeItem[]> = {
  GENERAL: Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    noticeTitle: `[공지] 파인더스 새로워진 검색 서비스 안내 (${i + 1})`,
    noticeType: "GENERAL",
    startDate: "2026.05.12",
    isNew: i < 2,
  })),
  EVENT: Array.from({ length: 5 }, (_, i) => ({
    id: i + 10,
    noticeTitle: `[이벤트] 5월 한정 포토랩 할인 쿠폰 증정 (${i + 1})`,
    noticeType: "EVENT",
    startDate: "2026.05.10",
    isNew: true,
  })),
  POLICY: Array.from({ length: 5 }, (_, i) => ({
    id: i + 20,
    noticeTitle: `[안내] 개인정보 처리방침 개정 알림 (${i + 1})`,
    noticeType: "POLICY",
    startDate: "2026.05.01",
    isNew: false,
  })),
};

export function NoticePage() {
  // useState에 제네릭으로 타입을 지정
  const [activeTab, setActiveTab] = useState<TabName>("일반공지");
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 파라미터에 tabName 지정으로 any 타입 방지
  const getNoticeType = (tabName: TabName): NoticeType => {
    switch (tabName) {
      case "일반공지":
        return "GENERAL";
      case "이벤트 안내":
        return "EVENT";
      case "약관/정책":
        return "POLICY";
      default:
        return "GENERAL";
    }
  };

  // API 호출 로직 (Mock 데이터 용)
  const fetchNotices = useCallback(async (tabName: TabName) => {
    setIsLoading(true);

    // API 호출 시뮬레이션 (네트워크 지연 0.3초)
    await new Promise((resolve) => setTimeout(resolve, 300));

    const type = getNoticeType(tabName);
    setNoticeList(MOCK_DATA[type]);
    setIsLoading(false);
  }, []);

  // 탭 변경 시마다 데이터 호출
  useEffect(() => {
    fetchNotices(activeTab);
  }, [activeTab, fetchNotices]);

  return (
    <div>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mt-2">
        {isLoading ? (
          // 로딩 상태
          <LoadingSpinner open={isLoading} />
        ) : noticeList.length > 0 ? (
          // 리스트 렌더링
          noticeList.map((notice) => (
            <NoticeListItem key={notice?.photoLabId} data={notice} />
          ))
        ) : (
          // 데이터가 없을 떄
          <EmptyOrderState description="아직 등록된 공지가 없어요" />
        )}
      </main>
    </div>
  );
}
