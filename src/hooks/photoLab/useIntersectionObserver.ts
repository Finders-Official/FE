import { useEffect, useRef } from "react";

interface UseIntersectionObserverOptions {
  //빠른무한.. 읽는 사람 죄송함다, 갑자기 생각났어요..
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
  onIntersect: () => void;
}

export function useIntersectionObserver({
  enabled = true,
  rootMargin = "100px",
  threshold = 0.1,
  onIntersect,
}: UseIntersectionObserverOptions) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [enabled, rootMargin, threshold, onIntersect]);

  return ref;
}
