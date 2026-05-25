import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyOrderState } from "@/components/mypage";
import { NoticeListItem } from "@/components/mypage/notice/NoticeListItem";
import { TabNavigation } from "@/components/mypage/notice/TabNavigaton";
import { useGetNoticeList } from "@/hooks/my";
import type { NoticeType, TabName } from "@/types/mypage/notice";
import { useState } from "react";

export function NoticePage() {
  // useState에 제네릭으로 타입을 지정
  const [activeTab, setActiveTab] = useState<TabName>("일반공지");
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

  const currentType = getNoticeType(activeTab);

  // 💡 API 호출 (React Query가 로딩, 에러, 캐싱을 모두 자동 관리)
  // 탭이 바뀔 때마다 currentType이 변경되어 자동으로 새 데이터를 불러옵니다.
  const { data: response, isLoading } = useGetNoticeList(currentType, 0, 10); // TODO: isError 처리 넣기

  // 응답에서 data 배열 추출 (데이터가 없거나 로딩 중이면 빈 배열)
  const noticeList = response?.data ?? [];

  return (
    <div className="flex h-full flex-col">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="mt-2 flex flex-1 flex-col">
        {isLoading ? (
          // 로딩 상태
          <LoadingSpinner open={isLoading} />
        ) : noticeList.length > 0 ? (
          // 리스트 렌더링
          noticeList.map((notice) => (
            <NoticeListItem key={notice?.id} data={notice} />
          ))
        ) : (
          // 데이터가 없을 떄
          <div className="flex flex-1">
            <EmptyOrderState description="아직 등록된 공지가 없어요" />
          </div>
        )}
      </main>
    </div>
  );
}
