import type { PostImage } from "@/types/photoFeed/postPreview";
import { useEffect, useRef, useState } from "react";

type Props = {
  images: PostImage[];
  altPrefix?: string;
};

export default function PhotoCarousel({ images, altPrefix = "photo" }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // 스크롤 위치로 현재 인덱스 계산 (스와이프/드래그/휠 전부 대응)
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const w = el.clientWidth;
      if (w === 0) return;
      const next = Math.round(el.scrollLeft / w);
      setIndex(next);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (to: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(images.length - 1, to));
    el.scrollTo({ left: el.clientWidth * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  // 빈 배열이면 렌더링 안 함
  if (!images || images.length === 0) return null;

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
        {images.map((img, i) => (
          <div
            key={`${img.imageUrl}-${i}`}
            className="hide-scrollbar w-full flex-none snap-center"
          >
            <img
              src={img.imageUrl}
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
