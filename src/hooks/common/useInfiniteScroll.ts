import { useEffect } from "react";

type Params<T extends Element> = {
  target: React.RefObject<T | null>;
  onIntersect: () => void;
  enabled?: boolean;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export function useInfiniteScroll<T extends Element>({
  target,
  onIntersect,
  enabled = true,
  root = null,
  rootMargin,
  threshold,
}: Params<T>) {
  useEffect(() => {
    if (!enabled) return;

    const el = target.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onIntersect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, target, onIntersect, root, rootMargin, threshold]);
}
