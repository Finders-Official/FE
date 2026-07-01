import { useLayoutEffect, useRef } from "react";

export function useFlipReorder<T extends HTMLElement = HTMLDivElement>(
  orderKey: string,
) {
  const containerRef = useRef<T>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const prev = prevRects.current;
    const items = container.querySelectorAll<HTMLElement>("[data-flip-key]");
    const nextRects = new Map<string, DOMRect>();
    const rafIds: number[] = [];

    const sameSet =
      prev.size === items.length &&
      Array.from(items).every((el) => prev.has(el.dataset.flipKey ?? ""));

    items.forEach((el) => {
      const key = el.dataset.flipKey;
      if (!key) return;
      const rect = el.getBoundingClientRect();
      nextRects.set(key, rect);

      const prevRect = prev.get(key);
      if (reduce || !sameSet || !prevRect) return;
      const dx = prevRect.left - rect.left;
      const dy = prevRect.top - rect.top;
      if (dx === 0 && dy === 0) return;

      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      rafIds.push(
        requestAnimationFrame(() => {
          el.style.transition =
            "transform var(--duration-medium) var(--ease-smooth-out)";
          el.style.transform = "";
        }),
      );
    });

    prevRects.current = nextRects;
    return () => rafIds.forEach((id) => cancelAnimationFrame(id));
  }, [orderKey]);

  return containerRef;
}
