import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";

import { getDevelopmentOrders } from "@/apis/developmentHistory/developmentHistory.api";
import { formatDevelopmentOrder } from "@/utils/developmentHistory/formatters";
import { CloseIcon } from "@/assets/icon";
import ScanResultViewer from "@/components/photoManage/ScanResultViewer";
import DevelopmentOrderCard from "@/components/developmentHistory/DevelopmentOrderCard";
import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import EmptyView from "@/components/common/EmptyView";

interface FormattedDevelopmentOrder {
  id: number;
  shopName: string;
  shopAddress: string;
  status: string;
  date: string;
  createdAt: string;
  tags: string;
  price: number;
  deliveryAddress?: string;
  thumbnailUrl: string;
  resultImageUrls: string[];
}

const PAGE_SIZE = 10;

const DevelopmentHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMenu = location.state?.isMenu;

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["developmentOrders", PAGE_SIZE],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const pageNum = (pageParam ?? 0) as number;
      const response = await getDevelopmentOrders(pageNum, PAGE_SIZE);

      return {
        items: response.data.map(formatDevelopmentOrder),
        hasNext: response.slice.hasNext,
      };
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasNext ? allPages.length : undefined; // 0부터 시작
    },
  });

  const orders: FormattedDevelopmentOrder[] = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? [];
  }, [data]);

  const hasData = orders.length > 0;

  const handleOpenViewer = (images: string[]) => {
    setSelectedImages(images);
    setIsViewerOpen(true);
  };

  useInfiniteScroll({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage && !isFetchingNextPage,
    rootMargin: "200px",
  });

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-neutral-900 text-neutral-100">
      {!hasData && !isLoading ? (
        isMenu ? (
          <EmptyView
            content={`현재 진행 중인 현상 작업이 완료되면,
이 곳에서 현상 의뢰 기록들을 
한눈에 확인할 수 있어요!`}
          />
        ) : (
          <EmptyView content={"아직 맡기신 현상 작업이 없어요"} />
        )
      ) : (
        <div className="pt-6 pb-24">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="text-[1.375rem] font-semibold text-neutral-100">
              지난 작업
            </h2>
            {isMenu && (
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex h-9 w-9 items-center justify-center text-neutral-200 active:opacity-70"
              >
                <CloseIcon className="h-3 w-3 text-neutral-200" />
              </button>
            )}
          </header>

          {isError ? (
            <div className="rounded-xl border border-neutral-800 p-4 text-sm text-neutral-300">
              현상 내역을 불러오는데 실패했습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((item) => (
                <DevelopmentOrderCard
                  key={item.id}
                  item={item}
                  onOpenViewer={handleOpenViewer}
                />
              ))}

              {hasNextPage && <div ref={loadMoreRef} className="h-10" />}

              {(isLoading || isFetchingNextPage) && (
                <div className="py-3 text-center text-sm text-neutral-400">
                  불러오는 중...
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <ScanResultViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={selectedImages}
      />
    </div>
  );
};

export default DevelopmentHistoryPage;
