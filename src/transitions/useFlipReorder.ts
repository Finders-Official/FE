import { useLayoutEffect, useRef } from "react";

type FlipReorderOptions = {
  /** true면 항목 제거로 남은 항목이 밀리는 이동도 FLIP한다 (기본은 동일 집합의 재정렬만) */
  animateRemovals?: boolean;
};

type FlipEntry = {
  el: HTMLElement;
  rect: DOMRect;
  prevRect: DOMRect | undefined;
};

const isOffscreen = (r: DOMRect) =>
  r.bottom < 0 ||
  r.top > window.innerHeight ||
  r.right < 0 ||
  r.left > window.innerWidth;

// FLIP이 끝나면 inline transition을 제거해 원래 클래스 트랜지션(.t-press 등)을 복원한다
const clearTransitionOnEnd = (el: HTMLElement) => {
  const done = (e: TransitionEvent) => {
    if (e.target !== el || e.propertyName !== "transform") return;
    if (e.type === "transitionend") el.style.transition = "";
    el.removeEventListener("transitionend", done);
    el.removeEventListener("transitioncancel", done);
  };
  el.addEventListener("transitionend", done);
  el.addEventListener("transitioncancel", done);
};

export function useFlipReorder<T extends HTMLElement = HTMLDivElement>(
  orderKey: string,
  { animateRemovals = false }: FlipReorderOptions = {},
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

    // 측정(read)을 전부 끝낸 뒤 스타일 변경(write)을 시작한다 — 인터리브하면
    // 항목 수만큼 강제 스타일 재계산이 발생한다
    const entries: FlipEntry[] = [];
    let allInPrev = true;
    items.forEach((el) => {
      const key = el.dataset.flipKey;
      if (!key) return;
      const rect = el.getBoundingClientRect();
      nextRects.set(key, rect);
      const prevRect = prev.get(key);
      if (!prevRect) allInPrev = false;
      entries.push({ el, rect, prevRect });
    });

    const sameSet = prev.size === entries.length && allInPrev;
    const removedOnly =
      animateRemovals && entries.length < prev.size && allInPrev;
    const shouldFlip = !reduce && (sameSet || removedOnly);

    prevRects.current = nextRects;
    if (!shouldFlip) return;

    const rafIds: number[] = [];
    entries.forEach(({ el, rect, prevRect }) => {
      if (!prevRect) return;
      const dx = prevRect.left - rect.left;
      const dy = prevRect.top - rect.top;
      if (dx === 0 && dy === 0) return;
      // 이동 전후 모두 화면 밖이면 보이지 않는 이동 — 애니메이션(레이어 승격) 생략
      if (isOffscreen(prevRect) && isOffscreen(rect)) return;

      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;
      rafIds.push(
        requestAnimationFrame(() => {
          el.style.transition =
            "transform var(--duration-medium) var(--ease-smooth-out)";
          el.style.transform = "";
          clearTransitionOnEnd(el);
        }),
      );
    });

    return () => rafIds.forEach((id) => cancelAnimationFrame(id));
  }, [orderKey, animateRemovals]);

  return containerRef;
}
