import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { getDevelopmentOrders } from "@/apis/developmentHistory/developmentHistory.api";
import { formatDevelopmentOrder } from "@/utils/developmentHistory/formatters";
import { ChevronLeftIcon, CloseIcon, FlimImageIcon } from "@/assets/icon";
import ScanResultViewer from "@/components/photoManage/ScanResultViewer";

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
      {!hasData && !isLoading ? (
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
      ) : (
        <div className="pt-6 pb-24">
          <div className="mb-4 flex items-center justify-between">
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
          </div>

          <div className="flex flex-col gap-4">
            {orders.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4.5 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-6"
              >
                <div className="flex justify-start gap-1 text-[0.8125rem] font-normal tracking-[-0.02em] text-neutral-200">
                  <span>{item.date}</span>
                  <span>·</span>
                  <span>{item.status}</span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="h-15 w-15 shrink-0 overflow-hidden rounded-[0.625rem] bg-[#333]">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.shopName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[1rem] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200">
                      {item.shopName}
                    </h3>
                    <p className="text-[0.875rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-600">
                      {item.shopAddress}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-875 flex flex-col gap-3 rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-5">
                    <span className="shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
                      맡기신 작업
                    </span>
                    <span className="text-right text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
                      {item.tags}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-5">
                    <span className="shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
                      총액
                    </span>
                    <span className="text-right text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>
                  {item.status === "배송" && item.deliveryAddress && (
                    <div className="flex items-start justify-between gap-5">
                      <span className="shrink-0 text-[0.9375rem] font-semibold tracking-[-0.02em] text-neutral-200">
                        배송지
                      </span>
                      <span className="text-right text-[0.9375rem] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
                        {item.deliveryAddress}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => handleOpenViewer(item.resultImageUrls)}
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <span className="text-[0.875rem] font-medium text-[#F0F0F0]">
                      스캔 사진 결과 보기
                    </span>
                    <ChevronLeftIcon className="h-4 w-4 rotate-180 text-[#888]" />
                  </button>

                  <div className="scrollbar-hide flex gap-2.75 overflow-x-auto pb-1">
                    {item.resultImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="h-19 w-24 shrink-0 overflow-hidden rounded-[0.625rem] bg-[#333]"
                      >
                        <img
                          src={url}
                          alt={`result-${idx}`}
                          className="h-full w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {hasNext && (
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="mt-4 rounded-xl border border-neutral-800 py-3 text-sm font-medium text-neutral-400 active:bg-neutral-800"
              >
                {isLoading ? "불러오는 중..." : "이전 내역 더보기"}
              </button>
            )}
          </div>
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
