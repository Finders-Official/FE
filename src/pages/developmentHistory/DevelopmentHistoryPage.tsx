import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { getDevelopmentOrders } from "@/apis/developmentHistory/developmentHistory.api";
import { formatDevelopmentOrder } from "@/utils/developmentHistory/formatters";
import { CloseIcon, FlimImageIcon } from "@/assets/icon";
import ScanResultViewer from "@/components/photoManage/ScanResultViewer";
import DevelopmentOrderCard from "@/components/developmentHistory/DevelopmentOrderCard";

interface FormattedDevelopmentOrder {
  id: number;
  shopName: string;
  shopAddress: string;
  status: string;
  date: string;
  tags: string;
  price: number;
  deliveryAddress?: string;
  thumbnailUrl: string;
  resultImageUrls: string[];
}

const DevelopmentHistoryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMenu = location.state?.isMenu;

  const [orders, setOrders] = useState<FormattedDevelopmentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  // 데이터 로딩 로직
  // TODO: 불러오는 중 대신 스켈레톤 UI
  const loadOrders = useCallback(
    async (pageNum: number) => {
      if (!hasNext && pageNum > 0) return;

      try {
        setIsLoading(true);
        const response = await getDevelopmentOrders(pageNum, 10);

        if (response.success) {
          const mappedData = response.data.map(formatDevelopmentOrder);
          setOrders((prev) =>
            pageNum === 0 ? mappedData : [...prev, ...mappedData],
          );
          setHasNext(response.slice.hasNext);
        }
      } catch (error) {
        console.error("현상 내역을 불러오는데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    },
    [hasNext],
  );

  useEffect(() => {
    loadOrders(0);
  }, [loadOrders]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadOrders(nextPage);
  };

  const handleOpenViewer = (images: string[]) => {
    setSelectedImages(images);
    setIsViewerOpen(true);
  };

  const hasData = orders.length > 0;

  return (
    <div className="mx-auto min-h-screen w-full max-w-md bg-neutral-900 text-neutral-100">
      {/* 1. 데이터가 없을 때 (Empty State) */}
      {!hasData && !isLoading ? (
        <EmptyOrderState />
      ) : (
        /* 2. 데이터가 있을 때 (Main Content) */
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

          <div className="flex flex-col gap-4">
            {orders.map((item) => (
              <DevelopmentOrderCard
                key={item.id}
                item={item}
                onOpenViewer={handleOpenViewer}
              />
            ))}

            {hasNext && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="mt-4 rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-400 active:bg-neutral-800 disabled:opacity-50"
              >
                {isLoading ? "불러오는 중..." : "이전 내역 더보기"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. 공통 뷰어 모달 */}
      <ScanResultViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={selectedImages}
      />
    </div>
  );
};

/**
 * 내부 컴포넌트: 데이터가 없을 때 표시
 */
const EmptyOrderState = () => (
  <div className="flex h-[calc(100vh-6.25rem)] w-full flex-col items-center justify-center">
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-center text-[1.1875rem] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
        아직 맡기신 현상 작업이 없어요
      </h2>
      <div className="flex h-23.5 w-23.5 items-center justify-center rounded-full bg-[#484848]/36">
        <FlimImageIcon className="h-11.5 w-11.5 text-neutral-400" />
      </div>
    </div>
  </div>
);

export default DevelopmentHistoryPage;
