import { useEffect, useMemo } from "react";

type ScrollAnchorData = {
  anchorId: string;
  offset: number;
};

function isScrollAnchorData(value: unknown): value is ScrollAnchorData {
  if (!value || typeof value !== "object") return false;

  const v = value as Record<string, unknown>;
  return typeof v.anchorId === "string" && typeof v.offset === "number";
}

export function useHorizontalScrollRestore(
  scrollRef: React.RefObject<HTMLElement | null>,
  sectionId: string,
) {
  const STORAGE_KEY = useMemo(
    () => `horizontal_scroll_anchor_${sectionId}`,
    [sectionId],
  );

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    let parsed: unknown;
    try {
      parsed = JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse scroll anchor data:", error);
      return;
    }

    if (!isScrollAnchorData(parsed)) return;

    const { anchorId, offset } = parsed;

    let isUserInteracting = false;
    const onUserInteraction = () => {
      isUserInteracting = true;
    };

    container.addEventListener("touchstart", onUserInteraction, {
      passive: true,
    });
    container.addEventListener("wheel", onUserInteraction, { passive: true });

    const restore = () => {
      if (isUserInteracting) return;

      const anchor = container.querySelector(
        `[data-anchor-id="${anchorId}"]`,
      ) as HTMLElement | null;

      if (!anchor) return;

      const targetScroll = anchor.offsetLeft + offset;

      if (Math.abs(container.scrollLeft - targetScroll) > 1) {
        container.scrollLeft = targetScroll;
      }
    };

    const observer = new MutationObserver(() => {
      requestAnimationFrame(restore);
    });

    observer.observe(container, { childList: true, subtree: true });
    requestAnimationFrame(restore);

    const timeoutId = setTimeout(() => {
      observer.disconnect();
      container.removeEventListener("touchstart", onUserInteraction);
      container.removeEventListener("wheel", onUserInteraction);
    }, 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      container.removeEventListener("touchstart", onUserInteraction);
      container.removeEventListener("wheel", onUserInteraction);
    };
  }, [scrollRef, STORAGE_KEY]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      const scrollLeft = container.scrollLeft;

      let bestAnchor: HTMLElement | null = null;

      for (const child of children) {
        if (!child.hasAttribute("data-anchor-id")) continue;

        const left = child.offsetLeft;
        const width = child.offsetWidth;

        if (left <= scrollLeft && left + width > scrollLeft) {
          bestAnchor = child;
          break;
        }
      }

      if (
        !bestAnchor &&
        children.length > 0 &&
        scrollLeft < children[0].offsetLeft
      ) {
        bestAnchor =
          children.find((c) => c.hasAttribute("data-anchor-id")) || null;
      }

      if (!bestAnchor) return;

      const anchorId = bestAnchor.getAttribute("data-anchor-id");
      if (!anchorId) return;

      const offset = scrollLeft - bestAnchor.offsetLeft;

      const payload: ScrollAnchorData = { anchorId, offset };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    };

    let debounceTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleScroll, 100);
    };

    container.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", onScroll);
      clearTimeout(debounceTimer);
    };
  }, [scrollRef, STORAGE_KEY]);

  const hasRestoredPosition = () => {
    return !!sessionStorage.getItem(STORAGE_KEY);
  };

  return { hasRestoredPosition };
}
