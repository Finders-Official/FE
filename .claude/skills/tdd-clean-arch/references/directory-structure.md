# 디렉토리 구조 가이드 (Finders Web)

이 프로젝트는 전형적인 `features/{x}/{domain,application,infrastructure,presentation}` 구조가 **아니다**.
**"타입별 top-level 폴더 + feature 서브폴더"** 구조를 사용한다.
이 문서는 각 폴더가 클린 아키텍처 레이어 중 무엇에 해당하는지, 무엇을 넣고 무엇을 넣지 않을지 정의한다.

## 목차

1. 전체 구조
2. 레이어 매핑
3. 폴더별 상세 + 예시
4. 의존성 규칙
5. 파일 생성 결정 기준

---

## 1. 전체 구조

```
src/
├── App.tsx
├── main.tsx
├── index.css                  # Tailwind @theme (색상/애니메이션) + global CSS
│
├── assets/
│   ├── icon/                  # SVG icon (currentColor + viewBox 유지) + barrel index.ts
│   └── fonts/
│
├── router/
│   └── Router.tsx             # createBrowserRouter, 모든 라우트 한 곳
│
├── layouts/                   # RootLayout / FooterLayout / MyPageLayout / PhotoManageLayout
│
├── pages/{feature}/           # 라우트 페이지 (Page suffix)
│
├── components/
│   ├── common/                # 공용 컴포넌트 + index.ts barrel
│   │   └── chips/             # Chip 계열
│   └── {feature}/             # feature 전용 컴포넌트
│
├── hooks/                     # ← Application 레이어
│   ├── common/
│   └── {feature}/             # Query/Mutation 훅, 도메인 조합 훅
│
├── apis/                      # ← Infrastructure 레이어
│   └── {feature}/
│       ├── {name}.api.ts      # 단일 책임 API 함수
│       └── index.ts           # barrel
│
├── store/                     # ← Presentation의 전역 UI 상태 (Zustand)
│   └── use{Name}.store.ts
│
├── types/                     # ← Domain 레이어 (타입·인터페이스)
│   └── {feature}/             # 또는 단일 파일 (photoLab.ts 등)
│
├── constants/                 # ← Domain 레이어 (상수·목데이터)
│   └── {feature}/
│
├── lib/                       # 전역 인프라 어댑터
│   ├── axiosInstance.ts       # 단일 axios 인스턴스
│   ├── setUpInterceptors.ts   # 토큰 첨부 + 401 reissue 큐 (등록은 main.tsx)
│   ├── billing/               # 네이티브 IAP 플러그인 JS 브릿지
│   └── payment/               # PortOne 웹결제
│
└── utils/                     # 순수 유틸 함수 (formatPhoneKorea, isValidText, ...)
                               # 예외: tokenStorage.ts·platform.ts는 Infrastructure 어댑터 (Capacitor 의존)
```

이 밖에 레포 루트의 `android/`·`ios/`는 Capacitor 네이티브 프로젝트 — 이 문서의 레이어 규칙 밖.

현재 feature 도메인: `auth`, `mainPage`, `photoLab`, `photoFeed`, `photoManage`, `photoRestoration`, `mypage`, `credit`, `payment`, `developmentHistory`, `filmCameraGuide`, `member`, `file`, `my`. 한 feature가 모든 폴더를 갖지는 않는다(`member`/`file`/`my`는 apis+hooks만).

---

## 2. 레이어 매핑

| 클린 아키텍처 레이어 | 이 프로젝트 위치                                                                                       | 역할                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| **Domain**           | `types/`, `constants/`, `utils/`의 순수 함수                                                           | 도메인 타입·상수·비즈니스 규칙                  |
| **Application**      | `hooks/{feature}/`                                                                                     | Query/Mutation·여러 서비스 조합 (Use Case 역할) |
| **Infrastructure**   | `apis/{feature}/*.api.ts`, `lib/axiosInstance.ts`, `lib/setUpInterceptors.ts`, `utils/tokenStorage.ts` | HTTP·스토리지·외부 어댑터                       |
| **Presentation**     | `pages/`, `components/`, `layouts/`, `router/`, `store/` (UI 전역 상태)                                | React UI + 라우팅 + UI 상태                     |

핵심: **레이어 이름의 폴더는 만들지 않는다.** 기존 폴더 구조를 유지하면서 의존성 방향만 지킨다.

---

## 3. 폴더별 상세 + 예시

### `src/types/{feature}/` — Domain (타입)

- 도메인 엔티티는 **plain `interface` / `type`** 으로 표현한다. **Entity/Value Object 클래스 만들지 않는다.**
- 비즈니스 불변식이 필요한 경우, `utils/` 또는 같은 폴더 안의 순수 함수로 표현한다.

```ts
// src/types/photoLab.ts (실제 코드)
export interface SimplePhotoLabItem {
  photoLabId: string; // 서버 ID는 TSID → 항상 string (number 금지)
  name: string;
  imageUrls: string[];
  address: string;
  distanceKm: number | null; // 위치 동의 없으면 null
  isFavorite: boolean;
  favoriteCount: number;
}

export type TaskType = "현상" | "스캔" | "현상+스캔";
```

### `src/constants/{feature}/` — Domain (상수·목데이터)

```ts
// src/constants/photoLab/reservation.ts
export const FILM_ROLL_MIN = 1;
export const FILM_ROLL_MAX = 20;
export const TASK_OPTIONS = ["현상", "스캔", "현상+스캔"] as const;
```

### `src/apis/{feature}/{name}.api.ts` — Infrastructure (HTTP 어댑터)

규칙:

- 한 파일 한 책임. 함수형, **클래스 금지** (`HttpXxxRepository` 패턴은 이 프로젝트에서 쓰지 않는다).
- `axiosInstance` 하나만 사용 (`lib/axiosInstance.ts`).
- 응답은 `ApiResponse<T>` 래퍼로 감싸져 있다 — `!body.success` 검사 후 throw.
- 배열 쿼리 파라미터는 콤마 join (`serializeListParams` 같은 helper) 후 전송.

```ts
// src/apis/photoLab/photoLab.api.ts (요약)
import { axiosInstance } from "@/lib/axiosInstance";
import type {
  PagedApiResponse,
  PhotoLabListParams,
  SimplePhotoLabItem,
} from "@/types/photoLab";

function serializeListParams(p: PhotoLabListParams) {
  return {
    ...p,
    regionIds: p.regionIds?.join(","), // 배열 파라미터는 콤마 join
  };
}

export async function getPhotoLabList(
  params: PhotoLabListParams,
): Promise<PagedApiResponse<SimplePhotoLabItem[]>> {
  const res = await axiosInstance.get<PagedApiResponse<SimplePhotoLabItem[]>>(
    "/photo-labs",
    { params: serializeListParams(params) },
  );
  if (!res.data.success) throw new Error(res.data.message);
  return res.data;
}
```

### `src/hooks/{feature}/use{Name}.ts` — Application (Use Case)

규칙:

- 한 훅 한 사용자 시나리오. (목록 조회 / 상세 조회 / 즐겨찾기 토글 / 폼 제출 흐름 등)
- queryKey: `["{domain}", "{action}", ...params]`
- staleTime/gcTime은 데이터 성질에 따라 명시 (`1000 * 60 * 5` 등).
- Mutation의 캐시 무효화는 같은 훅 안에서 처리.

```ts
// src/hooks/photoLab/usePhotoLabList.ts (실제 코드)
import { useInfiniteQuery } from "@tanstack/react-query";
import { getPhotoLabList } from "@/apis/photoLab";
import type {
  PhotoLabListParams,
  PagedApiResponse,
  SimplePhotoLabItem,
} from "@/types/photoLab";

type Params = Omit<PhotoLabListParams, "page" | "size">;

export function usePhotoLabList(params: Params, enabled = true) {
  return useInfiniteQuery<PagedApiResponse<SimplePhotoLabItem[]>, Error>({
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

### `src/store/use{Name}.store.ts` — Presentation (UI 전역 상태, Zustand)

규칙:

- **서버 상태를 여기 복제하지 않는다.** (TanStack Query 캐시가 단일 진실원)
- 로그인 사용자, 모달 토글, 다단계 폼 임시 상태 등 **UI/세션 전역 상태만**.
- 영속이 필요하면 `persist` + `partialize`로 필요 부분만 저장 (보안상 민감 정보는 저장 금지).
- 파일명 `useXxx.store.ts`, export `useXxxStore` (현재 코드와 일치).

```ts
// src/store/useAuth.store.ts (요약)
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = { memberId: number; nickname: string };
type AuthState = {
  user: User | null;
  setUser: (u: User) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    { name: "finders-auth", partialize: (s) => ({ user: s.user }) },
  ),
);
```

### `src/components/` — Presentation (UI)

- `components/common/`: 여러 feature에서 재사용되는 공용 컴포넌트 + `index.ts` barrel. 새 export 추가 시 barrel 갱신.
- `components/{feature}/`: 해당 feature 페이지에서만 쓰는 컴포넌트.
- 컴포넌트 Props는 `interface XxxProps`, named export.
- 비즈니스 로직(데이터 페칭, 변환)은 훅으로 분리, 컴포넌트는 렌더링/사용자 인터랙션에 집중.

### `src/pages/{feature}/{Name}Page.tsx` — Presentation (라우트 페이지)

- 페이지는 자체 데이터를 거의 들고 있지 않는다 — 훅을 호출하고 컴포넌트에 prop drilling 또는 store로 연결.
- 로딩/에러 UI 표시 책임.

### `src/router/Router.tsx`

- 모든 라우트는 여기 모인다.
- 레이아웃은 `<Route element={<Layout/>}>` 그룹.
- 새 페이지 추가 시 import + `<Route ... />` 한 줄 추가.

---

## 4. 의존성 규칙

화살표는 import 방향 (`A → B`: A가 B를 import).

```
components / pages / layouts  ──▶  hooks  ──▶  apis  ──▶  lib/axiosInstance
        │                            │           │
        │                            ▼           ▼
        └─▶  store  ─────────▶  types / constants / utils
                                    ▲
                                  (모두 여기로)
```

규칙:

- `types/`, `constants/`, `utils/`(순수 함수): 어떤 React/TanStack/Zustand/Capacitor import도 안 한다. (예외: `utils/tokenStorage.ts`·`utils/platform.ts`·`utils/auth/`는 Capacitor를 감싸는 Infrastructure 어댑터 — 새 순수 유틸에 이 패턴을 따라하지 말 것.)
- `apis/`: `types/`, `lib/`만 import. React, 훅, 컴포넌트 import 금지.
- `hooks/`: `apis/`, `types/`, `store/`, `utils/` import. **컴포넌트 import 금지.**
- `store/`: `types/`, `utils/` import. **API 호출 직접 하지 않는다.**
- `components/`, `pages/`: 모든 레이어 접근 가능. **단 API 함수를 직접 호출하지 말고 훅을 거친다.**
- feature 폴더 간 의존: 가능하면 최소화. 공유될 만한 것은 `common/`으로.

### 안티 패턴

```tsx
// ❌ 컴포넌트에서 API 함수 직접 호출 (Application 레이어 우회)
import { getPhotoLabList } from "@/apis/photoLab";
useEffect(() => { getPhotoLabList(...).then(setData); }, []);

// ❌ 스토어에서 API 함수 호출 (서버 상태를 클라이언트 상태로 복제)
const useStore = create((set) => ({
  labs: [],
  fetchLabs: async () => set({ labs: await getPhotoLabList(...) }),
}));

// ❌ API 함수에서 React 훅 사용
export async function getPhotoLabList() {
  const { user } = useAuthStore();   // 일반 함수에서 훅 호출 — 런타임 에러
  ...
}

// ❌ types/ 파일이 axios 응답을 직접 import
import type { AxiosResponse } from "axios";
```

---

## 5. 파일 생성 결정 기준

새 코드를 작성할 때 아래 질문을 순서대로:

| 질문                                                 | 예 → 위치                                                   | 아니오 → 다음 질문 |
| ---------------------------------------------------- | ----------------------------------------------------------- | ------------------ |
| 프레임워크 없이 동작하는 타입/상수인가?              | `types/{feature}/` 또는 `constants/{feature}/`              | 다음               |
| 외부 서비스(HTTP/스토리지)와 통신하는가?             | `apis/{feature}/{name}.api.ts` 또는 `lib/`                  | 다음               |
| TanStack Query/Mutation 또는 비즈니스 흐름 조합인가? | `hooks/{feature}/use{Name}.ts`                              | 다음               |
| 모든 페이지에서 공유되는 전역 UI/세션 상태인가?      | `store/use{Name}.store.ts`                                  | 다음               |
| 라우트로 도달하는 화면인가?                          | `pages/{feature}/{Name}Page.tsx` + `router/Router.tsx` 등록 | 다음               |
| 한 feature 안에서만 쓰이는 UI 조각인가?              | `components/{feature}/`                                     | 다음               |
| 두 개 이상 feature에서 쓰일 UI 조각인가?             | `components/common/` (+ barrel 갱신)                        | 다음               |
| 순수 함수 유틸리티인가?                              | `utils/{name}.ts`                                           | 위치 모호 — 묻기   |

### 새 feature를 추가할 때

`xyz`라는 새 feature를 만든다면:

1. `src/types/xyz/` 또는 `src/types/xyz.ts` — 도메인 타입
2. `src/apis/xyz/{name}.api.ts` (+ `index.ts` barrel)
3. `src/hooks/xyz/use{Name}.ts`
4. `src/store/useXyz.store.ts` (필요 시)
5. `src/components/xyz/`
6. `src/pages/xyz/XyzPage.tsx`
7. `src/router/Router.tsx`에 라우트 추가

모든 단계에서 **테스트 인프라가 있다면** 같은 디렉토리에 `*.test.ts(x)` co-locate.
