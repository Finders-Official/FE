import { useRef } from "react";

// 무한 목록의 "첫 페이지" 항목에만 등장 stagger 인덱스를 부여
export function useFirstPageStagger(itemCount: number, resetKey?: unknown) {
  const state = useRef<{ key: unknown; count: number | null }>({
    key: resetKey,
    count: null,
  });

  if (state.current.key !== resetKey) {
    state.current = { key: resetKey, count: null };
  }
  if (state.current.count === null && itemCount > 0) {
    state.current.count = itemCount;
  }

  const firstPageCount = state.current.count ?? 0;
  return (index: number): number | undefined =>
    index < firstPageCount ? index : undefined;
}
