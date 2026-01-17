import { useState } from "react";
import { CloseIcon } from "@/assets/icon";
import { EllipsisVerticalIcon } from "@/assets/icon";
import { DownloadIcon } from "@/assets/icon";

interface ScanResultViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

const ScanResultViewer = ({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
}: ScanResultViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const minSwipeDistance = 50;

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  const handleDownload = () => {
    console.log(`Downloading image: ${currentImage}`);
  };

  const handleDownloadAll = () => {
    console.log("Downloading all images...");
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex h-full w-full flex-col bg-neutral-900/10">
      {/* 1. 헤더 */}
      <header className="absolute top-13.75 right-0 left-0 z-50 flex h-14 items-center justify-between px-4">
        <button
          onClick={onClose}
          className="text-neutral-0 flex h-9 w-9 items-center justify-center active:opacity-70"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-9 w-9 items-center justify-center text-neutral-200 active:opacity-70"
          >
            <EllipsisVerticalIcon className="h-6 w-6" />
          </button>

          {isMenuOpen && (
            <div className="bg-neutral-875/90 absolute top-full right-0 mt-2 w-36.25 rounded-2xl border border-neutral-800 p-4 backdrop-blur-md transition-all">
              <button
                onClick={handleDownloadAll}
                className="hover:text-neutral-0 w-full text-center text-[15px] font-normal tracking-[-0.02em] text-neutral-100"
              >
                사진 전체 다운로드
              </button>
            </div>
          )}
        </div>
      </header>

      {/* 2. 메인 이미지 뷰어 (스와이프 영역) */}
      <div
        className="bg-neutral-1000/80 relative flex h-full w-full flex-1 items-center justify-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative flex max-h-full max-w-full items-center justify-center">
          <img
            src={currentImage}
            alt={`scan-result-${currentIndex}`}
            className="h-auto max-h-full w-auto max-w-full object-contain select-none"
            draggable={false}
          />

          {/* 개별 다운로드 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
            className="border-neutral-750 bg-neutral-1000/40 absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border text-neutral-400 backdrop-blur-xs transition-transform active:scale-95"
          >
            <DownloadIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3. 하단 썸네일 리스트 */}
      <div className="from-neutral-1000/80 absolute right-0 bottom-0 left-0 z-30 w-full bg-linear-to-t to-transparent pt-4 pb-10">
        <div className="scrollbar-hide flex gap-2.75 overflow-x-auto px-5">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-15 w-15 shrink-0 overflow-hidden rounded-[10px] border transition-all ${
                currentIndex === idx
                  ? "border-neutral-100 opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={img}
                alt={`thumb-${idx}`}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanResultViewer;
