import { useEffect, useRef, useState, type RefObject } from "react";

type UseCarouselReturn = {
  index: number;
  scrollerRef: RefObject<HTMLDivElement | null>;
  scrollTo: (to: number) => void;
};

export function useCarousel(length: number): UseCarouselReturn {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

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
    const clamped = Math.max(0, Math.min(length - 1, to));
    el.scrollTo({ left: el.clientWidth * clamped, behavior: "smooth" });
    setIndex(clamped);
  };

  return { index, scrollerRef, scrollTo };
}
