import { useCallback, useRef, useState } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyOrderState } from "@/components/mypage";
import { NoticeListItem } from "@/components/mypage/notice/NoticeListItem";
import { TabNavigation } from "@/components/mypage/notice/TabNavigaton";
import type { NoticeType, TabName } from "@/types/mypage/notice";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll"; // 💡 무한 스크롤 옵저버 훅
import { useFirstPageStagger } from "@/hooks/common/useFirstPageStagger";
import { useNoticeListInfinite } from "@/hooks/my";
import { StaggerItem } from "@/components/common";

export function NoticePage() {
  const [activeTab, setActiveTab] = useState<TabName>("일반공지");

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

  // 무한 스크롤 API 훅 사용
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNoticeListInfinite(currentType, 10);

  // 여러 페이지(page)의 배열 평탄화
  const noticeList = data?.pages.flatMap((page) => page.data) ?? [];
  // 탭(공지 타입) 변경은 새 데이터셋
  const staggerIndexFor = useFirstPageStagger(noticeList.length, currentType);

  // --- 무한 스크롤 옵저버 로직 ---
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const onIntersect = useCallback(() => {
    if (!hasNextPage) return;
    if (isFetchingNextPage) return;
    fetchNextPage(); // 다음 페이지 데이터 호출
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useInfiniteScroll({
    target: bottomRef,
    onIntersect,
    enabled: !isLoading && !isError,
    root: null,
    rootMargin: "200px", // 바닥에 닿기 200px 전에 미리 호출
    threshold: 0,
  });

  return (
    <div className="flex h-full flex-col">
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/*  스크롤이 발생하도록 overflow-y-auto 추가 */}
      <main className="mt-2 flex flex-1 flex-col overflow-y-auto">
        {isLoading ? (
          <LoadingSpinner open={isLoading} />
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center text-neutral-400">
            공지사항을 불러오는 중 오류가 발생했습니다.
          </div>
        ) : noticeList.length > 0 ? (
          <div className="flex flex-col">
            {noticeList.map((notice, index) => (
              <StaggerItem key={notice.id} index={staggerIndexFor(index)}>
                <NoticeListItem data={notice} />
              </StaggerItem>
            ))}

            {/* 추가 데이터 로딩 인디케이터 */}
            {isFetchingNextPage && (
              <div className="py-4 text-center text-sm text-neutral-400">
                더 불러오는 중...
              </div>
            )}

            {/* 무한 스크롤 감지용 Sentinel */}
            <div ref={bottomRef} className="h-1 w-full" />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState description="아직 등록된 공지가 없어요" />
          </div>
        )}
      </main>
    </div>
  );
}
