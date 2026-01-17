import { DEVELOPMENT_HISTORY_DATA } from "./constants";
import { ChevronLeftIcon } from "@/assets/icon";
import { FlimImageIcon } from "@/assets/icon";
import { useState } from "react";
import ScanResultViewer from "@/components/photoManage/ScanResultViewer";

const DevelopmentHistoryPage = () => {
  const data = DEVELOPMENT_HISTORY_DATA;
  const hasData = data.length > 0;

  // 뷰어 상태 관리
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleOpenViewer = (images: string[]) => {
    setSelectedImages(images);
    setIsViewerOpen(true);
  };

  const newLocal =
    "mx-auto min-h-screen w-full max-w-md bg-neutral-900 text-neutral-100";
  return (
    <div className={newLocal}>
      {/* 1. 데이터가 없을 때 (PM-000-1) */}
      {!hasData ? (
        // 레이아웃 중앙 정렬 (탭바 높이 등을 고려해 시각적 중앙 배치)
        <div className="flex h-[calc(100vh-100px)] w-full flex-col items-center justify-center">
          {/* 컨텐츠 래퍼 */}
          <div className="flex flex-col items-center gap-5">
            {/* 텍스트 */}
            <h2 className="text-center text-[19px] leading-[128%] font-semibold tracking-[-0.02em] text-neutral-100">
              아직 맡기신 현상 작업이 없어요
            </h2>

            {/* 아이콘 */}
            <div className="flex h-23.5 w-23.5 items-center justify-center rounded-full bg-[#484848]/36">
              <FlimImageIcon className="h-11.5 w-11.5 text-neutral-400" />
            </div>
          </div>
        </div>
      ) : (
        /* 2. 데이터가 있을 때 (PM-000-2) */
        <div className="px-5 pt-6 pb-24">
          <h2 className="mb-4 text-[20px] font-bold text-neutral-100">
            지난 작업
          </h2>

          <div className="flex flex-col gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4.5 rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-6"
              >
                {/* 날짜 · 상태 */}
                <div className="flex justify-start gap-1 text-[13px] font-normal tracking-[-0.02em] text-neutral-200">
                  <span>{item.date}</span>
                  <span>·</span>
                  <span>{item.status}</span>
                </div>

                {/* 업체 정보 */}
                <div className="flex items-center gap-5">
                  <div className="h-15 w-15 shrink-0 overflow-hidden rounded-[10px] bg-[#333]">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.shopName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <h3 className="text-[16px] leading-[155%] font-semibold tracking-[-0.02em] text-neutral-200">
                      {item.shopName}
                    </h3>
                    <p className="text-[14px] leading-[155%] font-normal tracking-[-0.02em] text-neutral-600">
                      {item.shopAddress}
                    </p>
                  </div>
                </div>

                {/* 상세 정보 박스 */}
                <div className="bg-neutral-875 flex flex-col gap-3 rounded-2xl p-5">
                  {/* 맡기신 작업 */}
                  <div className="flex items-start justify-between gap-5">
                    <span className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-neutral-200">
                      맡기신 작업
                    </span>
                    <span className="text-right text-[15px] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
                      {item.tags}
                    </span>
                  </div>

                  {/* 총액 */}
                  <div className="flex items-start justify-between gap-5">
                    <span className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-neutral-200">
                      총액
                    </span>
                    <span className="text-right text-[15px] leading-[155%] font-normal tracking-[-0.02em] text-neutral-400">
                      {item.price.toLocaleString()}원
                    </span>
                  </div>

                  {/* 배송지 (조건부 렌더링) */}
                  {item.status === "배송" && item.deliveryAddress && (
                    <div className="flex items-start justify-between gap-5">
                      <span className="shrink-0 text-[15px] font-semibold tracking-[-0.02em] text-neutral-200">
                        배송지
                      </span>
                      <span className="text-right text-[15px] leading-[155%] font-normal tracking-[-0.02em] break-keep text-neutral-400">
                        {item.deliveryAddress}
                      </span>
                    </div>
                  )}
                </div>

                {/* 하단 버튼 및 이미지 영역 */}
                <div className="flex flex-col gap-3">
                  {/* 결과 보기 버튼 */}
                  <button
                    onClick={() => handleOpenViewer(item.resultImageUrls)}
                    className="mb-3 flex w-full items-center justify-between"
                  >
                    <span className="text-[14px] font-medium text-[#F0F0F0]">
                      스캔 사진 결과 보기
                    </span>
                    <ChevronLeftIcon className="h-4 w-4 rotate-180 text-[#888]" />
                  </button>

                  {/* 저장 만료일 - 데이터가 없다면 하드코딩 혹은 제외 */}
                  <div className="text-[14px] font-normal tracking-[-0.02em] text-neutral-600">
                    26/1/10 저장 만료
                  </div>

                  {/* 이미지 리스트 */}
                  <div className="scrollbar-hide flex gap-2.75 overflow-x-auto pb-1">
                    {item.resultImageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        className="h-19 w-24 shrink-0 overflow-hidden rounded-[10px] bg-[#333]"
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
          </div>
        </div>
      )}
      {/* 뷰어 컴포넌트 (조건부 렌더링) */}
      <ScanResultViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={selectedImages}
      />
    </div>
  );
};

export default DevelopmentHistoryPage;
