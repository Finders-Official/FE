# 상태 관리 가이드 (Zustand v5 + TanStack Query v5)

이 프로젝트는 **TanStack Query (서버 상태) + Zustand (UI/세션 전역 상태)** 조합을 사용한다.
이 문서는 두 도구의 분담, 프로젝트 컨벤션, 그리고 이 프로젝트에 잘 맞는 패턴을 정리한다.

## 목차

1. 상태 분류 원칙
2. TanStack Query 패턴 (이 프로젝트 컨벤션)
3. Zustand 패턴 (이 프로젝트 컨벤션)
4. 조합 예시
5. 안티 패턴

---

## 1. 상태 분류 원칙

```
"이 데이터의 출처는 어디인가?"

서버 → TanStack Query
  · API 응답, 캐시 데이터
  · hooks/{feature}/use{Name}.ts

전역 클라이언트 → Zustand
  · 로그인 사용자, 모달 토글, 다단계 폼 임시 상태
  · store/use{Name}.store.ts

페이지/컴포넌트 로컬 → useState/useReducer
  · 입력값, 토글, 페이지 안에서만 쓰이는 임시 상태
  · 굳이 store로 끌어올리지 않는다

URL → React Router v7
  · useSearchParams, useParams
```

**핵심 규칙**: 서버 데이터를 Zustand에 복제하지 않는다. TanStack Query 캐시가 single source of truth.

---

## 2. TanStack Query 패턴

### 2.1 queryKey 컨벤션 (프로젝트 표준)

이 프로젝트는 **평면 배열 컨벤션**을 쓴다:

```ts
queryKey: ["{domain}", "{action}", ...params];
```

예시:

```ts
["photoLab", "list", params][("photoLab", "detail", labId)][
  ("photoLab", "popular")
][("photoFeed", "post", postId)][("my", "likedPost")];
```

> Query Key Factory 패턴(`productKeys.lists()` 등)은 이 프로젝트에는 아직 도입되어 있지 않다.
> 무효화 대상 키가 많아져 관리가 힘들어지면 그때 도입을 논의한다 — **선제 추상화 금지** (Karpathy 0.2).

### 2.2 Query 훅

```ts
// src/hooks/photoLab/usePopularPhotoLabs.ts (예)
import { useQuery } from "@tanstack/react-query";
import { getPopularPhotoLabs } from "@/apis/photoLab";

export function usePopularPhotoLabs() {
  return useQuery({
    queryKey: ["photoLab", "popular"],
    queryFn: getPopularPhotoLabs,
    staleTime: 1000 * 60 * 5, // 5분 fresh
    gcTime: 1000 * 60 * 10, // 10분 캐시 (v5: cacheTime → gcTime)
  });
}
```

### 2.3 무한스크롤 패턴 (페이지네이션)

이 프로젝트의 페이지네이션 응답은 `pagination.hasNext`를 가진 `PagedApiResponse<T>` 형태:

```ts
// src/hooks/photoLab/usePhotoLabList.ts (실제 코드)
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPhotoLabList } from "@/apis/photoLab";
import type {
  PhotoLabListParams,
  PagedApiResponse,
  PhotoLabItem,
} from "@/types/photoLab";

type Params = Omit<PhotoLabListParams, "page" | "size">;

export function usePhotoLabList(params: Params, enabled = true) {
  return useInfiniteQuery<PagedApiResponse<PhotoLabItem[]>, Error>({
    queryKey: ["photoLab", "list", params],
    queryFn: ({ pageParam }) =>
      getPhotoLabList({ ...params, page: pageParam as number }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.pagination.hasNext ? last.pagination.page + 1 : undefined,
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
```

### 2.4 Mutation + 캐시 무효화

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFavorite, removeFavorite } from "@/apis/photoLab";

export function useFavoriteToggle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      labId,
      isFavorite,
    }: {
      labId: string;
      isFavorite: boolean;
    }) => (isFavorite ? removeFavorite(labId) : addFavorite(labId)),
    onSuccess: () => {
      // 영향 받는 쿼리만 정확히 무효화
      qc.invalidateQueries({ queryKey: ["photoLab", "list"] });
      qc.invalidateQueries({ queryKey: ["photoLab", "popular"] });
    },
  });
}
```

### 2.5 Optimistic Update (즐겨찾기·좋아요처럼 즉시 반응이 중요한 경우)

**프로젝트 컨벤션**: onMutate에서 **불리언 플래그(isFavorite)만 플립**한다. 파생 카운트(favoriteCount)는 ±1 수동 계산하지 않는다 — onSettled의 invalidate가 서버 값으로 정산한다. 실제 구현은 `hooks/photoLab/useFavoriteToggle.ts` 참고 (영향받는 캐시가 여러 개면 전부 플립+롤백+invalidate).

```ts
export function useFavoriteToggle() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      labId,
      isFavorite,
    }: {
      labId: string;
      isFavorite: boolean;
    }) => (isFavorite ? removeFavorite(labId) : addFavorite(labId)),

    onMutate: async ({ labId, isFavorite }) => {
      const key = ["photoLab", "detail", labId];
      await qc.cancelQueries({ queryKey: key });

      const previous = qc.getQueryData<PhotoLabDetail>(key);
      qc.setQueryData<PhotoLabDetail>(
        key,
        (old) => (old ? { ...old, isFavorite: !isFavorite } : old), // 카운트는 건드리지 않는다
      );
      return { previous, key };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx) qc.setQueryData(ctx.key, ctx.previous);
    },

    onSettled: (_data, _err, { labId }) => {
      qc.invalidateQueries({ queryKey: ["photoLab", "detail", labId] });
    },
  });
}
```

### 2.6 QueryClient 기본 설정

`src/main.tsx`에 있다 (실제 코드 — 인터셉터 등록도 여기서):

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // 모바일 앱 특성상 비활성화
    },
    mutations: { retry: 0 },
  },
});
```

전역 staleTime/gcTime 기본값은 없다 — **각 훅에서 데이터 성질에 맞게 명시**한다 (기존 관례: `1000 * 60 * 5` / `1000 * 60 * 10`).

---

## 3. Zustand 패턴 (프로젝트 컨벤션)

### 3.1 파일·네이밍

- 파일: `src/store/use{Name}.store.ts`
- export 이름: `use{Name}Store` (예: `useAuthStore`, `useLoginModalStore`)
- 타입 정의는 `type`을 선호 (`useAuth.store.ts` 참고)

### 3.2 기본 스토어

```ts
import { create } from "zustand";

type User = { memberId: number; nickname: string };

type AuthState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
```

### 3.3 Persist 미들웨어 + partialize (영속이 필요할 때만)

`useAuth.store.ts`처럼 부분만 저장하고, 민감 정보는 저장하지 않는다:

```ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "finders-auth", // localStorage 키
      partialize: (s) => ({ user: s.user }), // 저장할 필드만 화이트리스트
    },
  ),
);
```

토큰은 Zustand에 넣지 않는다 — `utils/tokenStorage.ts` 경유 (웹=localStorage, 네이티브=SecureStorage, **비동기 API**). refreshToken은 httpOnly 쿠키. 상세는 CLAUDE.md 인증 섹션.

### 3.4 복수 값 선택 시 `useShallow` (v5 필수)

v5에서 배열/객체 반환 selector는 무한 루프 위험 — `useShallow`로 안정화:

```ts
import { useShallow } from "zustand/shallow";

// ❌ v5에서 매 렌더마다 새 배열 → 무한 루프 가능
const [user, isOpen] = useAuthStore((s) => [s.user, s.isOpen]);

// ✅
const [user, isOpen] = useAuthStore(useShallow((s) => [s.user, s.isOpen]));

// ✅ 객체로 선택
const { user, isOpen } = useAuthStore(
  useShallow((s) => ({ user: s.user, isOpen: s.isOpen })),
);
```

단일 값은 그냥:

```ts
const user = useAuthStore((s) => s.user);
```

### 3.5 스토어 분리 원칙

- **feature 단위로 스토어를 분리**한다. 모놀리식 글로벌 스토어 금지.
- 현재 프로젝트의 스토어 (`src/store/`):
  - `useAuth` — 로그인 사용자
  - `useLoginModal` — 로그인 모달 토글
  - `useNewPostState` — 새 글 작성 중인 임시 상태
  - `usePhotoLabFilter` — 현상소 필터 상태
  - `usePrintOrder` — 인화 주문 다단계 상태
  - `useAddressId` — 선택된 배송지 ID
  - `usePaymentOrder` — 크레딧 결제 진행 상태
- 두 feature가 같은 스토어가 필요해지면 그때 합친다. 미리 합치지 않는다 (Karpathy 0.2).

---

## 4. 조합 예시

```tsx
// pages/photoLab/PhotoLabPage.tsx
import { usePhotoLabList } from "@/hooks/photoLab/usePhotoLabList";
import { usePhotoLabFilterStore } from "@/store/usePhotoLabFilter.store";

export default function PhotoLabPage() {
  // UI/필터 상태 — Zustand
  const filter = usePhotoLabFilterStore((s) => s.filter);

  // 서버 상태 — TanStack Query
  const { data, fetchNextPage, hasNextPage, isLoading } =
    usePhotoLabList(filter);

  if (isLoading) return <ListSkeleton />;

  return (
    <PhotoLabList
      pages={data?.pages ?? []}
      onLoadMore={hasNextPage ? fetchNextPage : undefined}
    />
  );
}
```

---

## 5. 안티 패턴

```ts
// ❌ 서버 데이터를 Zustand에 복제
export const usePhotoLabStore = create((set) => ({
  labs: [],
  fetchLabs: async () => {
    const data = await getPhotoLabList(...);
    set({ labs: data });          // TanStack Query 캐시와 동기화 안 됨
  },
}));

// ❌ 스토어에서 fetch 호출 → 에러/로딩/캐시 직접 관리해야 함
// → useQuery 훅으로 옮긴다.

// ❌ queryKey에 객체 참조를 그대로 박기 (안정적 동등성 X)
useQuery({
  queryKey: ["photoLab", "list", { ...params, ts: Date.now() }],  // 매번 캐시 미스
});

// ❌ Mutation 후 모든 쿼리 무효화 (oversweep)
qc.invalidateQueries();   // 전체 무효화 — 너무 비싸다
// ✅ 영향받는 키만:
qc.invalidateQueries({ queryKey: ["photoLab", "list"] });

// ❌ 컴포넌트에서 useEffect로 페칭
useEffect(() => { getPhotoLabList(...).then(setData); }, [params]);
// ✅ useQuery 훅 사용
```

---

## 6. 클린 아키텍처에서의 위치

- **Zustand 스토어** = Presentation 레이어 (UI/세션 전역 상태) → `src/store/`
- **TanStack Query 훅** = Application 레이어 (Use Case) → `src/hooks/{feature}/`
- **API 함수** = Infrastructure 레이어 → `src/apis/{feature}/`
- **types/constants/utils** = Domain 레이어 → 상태 관리 도구를 import 하지 않는다
