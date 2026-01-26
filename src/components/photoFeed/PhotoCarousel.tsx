import { useCarousel } from "@/hooks/useCarousel";

type Props = {
  images: string[];
  altPrefix?: string;
};

export default function PhotoCarousel({ images, altPrefix = "photo" }: Props) {
  const { index, scrollerRef, scrollTo } = useCarousel(images.length);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
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
          <div
            key={`${src}-${i}`}
            className="hide-scrollbar w-full flex-none snap-center"
          >
            <img
              src={src}
              alt={`${altPrefix}-${i + 1}`}
              className="h-[361px] w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {/* 점 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollTo(i)}
              aria-label={`${i + 1}번째 사진`}
              className={`h-1.5 w-1.5 rounded-full transition-opacity ${
                i === index ? "bg-white opacity-100" : "bg-white opacity-50"
              }`}
            />
          ))}
        </div>
      )}

      {/* 우상단 "1/3" 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-3 right-3 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
          {index + 1}/{images.length}
        </div>
      )}
    </div>
  );
}
