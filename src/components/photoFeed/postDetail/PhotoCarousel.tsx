import { useCarousel } from "@/hooks/common/useCarousel";
import type { PostImage } from "@/types/photoFeed/postPreview";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: PostImage[];
  altPrefix?: string;
};

const MIN_H = 11.25; // rem
const MAX_H = 35; // rem
const ROOT_FONT_SIZE = 16;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PhotoCarousel({ images, altPrefix = "photo" }: Props) {
  const { index, scrollerRef, scrollTo } = useCarousel(images.length);

  // 캐러셀 폭(px)
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [frameW, setFrameW] = useState(0);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      setFrameW(entry.contentRect.width); // px
    });
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // 첫 번째 사진 비율 → 높이(rem) 계산 + clamp
  const fixedHRem = useMemo(() => {
    const first = images[0];
    if (!first || !frameW) return MIN_H;

    const { width: w, height: h } = first;
    if (!w || !h) return MIN_H;

    // px → rem
    const rawPx = frameW * (h / w);
    const rawRem = rawPx / ROOT_FONT_SIZE;

    return clamp(rawRem, MIN_H, MAX_H);
  }, [images, frameW]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl">
      {/* 첫 사진 기준으로 높이 고정 (rem) */}
      <div ref={frameRef} style={{ height: `${fixedHRem}rem` }}>
        <div
          ref={scrollerRef}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
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
              {/* 모든 이미지는 동일한 높이를 사용 */}
              <img
                src={img.imageUrl}
                alt={`${altPrefix}-${i + 1}`}
                draggable={false}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
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
