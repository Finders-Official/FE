import { useEffect } from "react";
import { useLocation } from "react-router";

export function useAnchorScroll(
  scrollRef: React.RefObject<HTMLDivElement | null>,
) {
  const location = useLocation();
  const STORAGE_KEY = `scroll_anchor_${location.pathname}`;

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    let parsed;
    try {
      parsed = JSON.parse(stored);
    } catch {
      return;
    }
    const { anchorId, offset } = parsed;
    if (!anchorId) return;

    let isUserInteracting = false;
    const onUserInteraction = () => {
      isUserInteracting = true;
    };

    // 사용자가 수동으로 스크롤을 시작하면 자동 복원 중단
    container.addEventListener("touchstart", onUserInteraction, {
      passive: true,
    });
    container.addEventListener("wheel", onUserInteraction, { passive: true });

    const restore = () => {
      if (isUserInteracting) return;

      const anchor = container.querySelector(
        `[data-anchor="${anchorId}"]`,
      ) as HTMLElement;
      if (anchor) {
        // 상대적 오프셋을 유지하기 위해 필요한 절대적 scrollTop 계산
        const targetScroll = anchor.offsetTop + offset;

        // 미세한 떨림을 방지하기 위해 유의미한 차이가 있을 때만 적용
        if (Math.abs(container.scrollTop - targetScroll) > 1) {
          container.scrollTop = targetScroll;
        }
      }
    };

    // 비동기 데이터 로딩으로 인한 레이아웃 변화를 처리하기 위해 MutationObserver 사용
    const observer = new MutationObserver(() => {
      requestAnimationFrame(restore);
    });

    observer.observe(container, { childList: true, subtree: true });
    requestAnimationFrame(restore);

    // 무한한 관찰을 방지하기 위해 5초 후 복원 로직 중단
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
      const scrollTop = container.scrollTop;

      let bestAnchor: HTMLElement | null = null;

      // 현재 뷰포트 최상단에 있는 요소를 찾음
      for (const child of children) {
        if (!child.hasAttribute("data-anchor")) continue;

        const top = child.offsetTop;
        const height = child.offsetHeight;

        if (top <= scrollTop && top + height > scrollTop) {
          bestAnchor = child;
          break;
        }
      }

      // 폴백: 최상단에 도달한 경우
      if (
        !bestAnchor &&
        children.length > 0 &&
        scrollTop < children[0].offsetTop
      ) {
        bestAnchor =
          children.find((c) => c.hasAttribute("data-anchor")) || null;
      }

      if (bestAnchor) {
        const anchorId = bestAnchor.getAttribute("data-anchor");
        if (anchorId) {
          const offset = scrollTop - bestAnchor.offsetTop;
          sessionStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ anchorId, offset }),
          );
        }
      }
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
}
