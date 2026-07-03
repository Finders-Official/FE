import { useRef } from "react";

// 등장 지연 클램프: index * 40ms 이므로 8이면 최대 320ms. 첫 페이지가 커도 지연이 무한정 늘지 않게 한다.
const MAX_STAGGER_INDEX = 8;

// 무한 목록의 "첫 페이지" 항목에만 등장 stagger 인덱스를 부여한다.
// 뒤로가기 등으로 페이지가 리마운트될 때 TanStack Query 캐시가 이미 로드된 여러 페이지를
// 동기적으로 되살리는데, 이 경우(마운트 시점에 이미 데이터가 있음)는 첫 로드가 아니라 "복원"이므로
// 재-stagger하지 않는다. resetKey가 바뀌면(새 검색 등) 다시 첫 로드로 간주해 stagger를 허용한다.
export function useFirstPageStagger(itemCount: number, resetKey?: unknown) {
  const state = useRef<{
    key: unknown;
    firstPageCount: number | null;
    restored: boolean;
  }>({
    key: resetKey,
    firstPageCount: null,
    restored: itemCount > 0, // 마운트 시점에 데이터가 있으면 캐시 복원으로 본다
  });

  if (state.current.key !== resetKey) {
    // 새 데이터셋: 첫 로드로 재무장(restored=false)해 stagger를 다시 허용
    state.current = { key: resetKey, firstPageCount: null, restored: false };
  }
  if (state.current.firstPageCount === null && itemCount > 0) {
    // 복원이면 0(=아무것도 stagger 안 함), 신규 로드면 첫 페이지 개수를 lock
    state.current.firstPageCount = state.current.restored ? 0 : itemCount;
  }

  const firstPageCount = state.current.firstPageCount ?? 0;
  return (index: number): number | undefined =>
    index < firstPageCount ? Math.min(index, MAX_STAGGER_INDEX) : undefined;
}
