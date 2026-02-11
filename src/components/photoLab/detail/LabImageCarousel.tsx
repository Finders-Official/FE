import { useCarousel } from "@/hooks/common/useCarousel";

type Props = {
  images: string[];
  altPrefix?: string;
};

export default function LabImageCarousel({
  images,
  altPrefix = "lab-image",
}: Props) {
  const { index, scrollerRef } = useCarousel(images.length);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      {/* 이미지 스크롤 영역 */}
      <div
        ref={scrollerRef}
        className="flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="w-full flex-none snap-center">
            <img
              src={src}
              alt={`${altPrefix}-${i + 1}`}
              className="h-[13.6875rem] w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 우상단 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 flex items-center justify-center rounded-[3.125rem] bg-black/60 px-2 py-1">
          <span className="text-xs leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100">
            {index + 1}
          </span>
          <span className="text-xs leading-[1.26] font-normal tracking-[-0.02em] text-neutral-100">
            /{images.length}
          </span>
        </div>
      )}
    </div>
  );
}
