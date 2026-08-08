# 라우팅 · 폼 · HTTP 클라이언트 가이드 (Finders Web)

이 문서는 이 프로젝트의 라우팅(React Router v7), 폼 처리, HTTP(axios + ApiResponse 래퍼) 패턴을 정리한다.

## 목차

1. React Router v7
2. 폼 — 현재 패턴과 RHF+Zod 도입 가이드
3. HTTP 클라이언트 — axiosInstance + ApiResponse 래퍼
4. 데이터 흐름 정리

---

## 1. React Router v7

### 1.1 기본 구조

이 프로젝트는 `createBrowserRouter` 기반이며, **모든 라우트를 `src/router/Router.tsx` 한 파일에 모아둔다.**
라우트 트리는 traditional element 방식 (현재 코드 — data-mode loader/action은 아직 미사용).

```tsx
// src/router/Router.tsx (요약 — 실제 스타일)
// 도메인별 라우트 배열 상수를 만들고 스프레드로 조립한다. element 대신 Component 속성 사용.
const footerRoutes = [
  { path: "mainpage", Component: MainPage },
  { path: "photolab", Component: PhotoLabPage },
  // ...
];

const mypageRoutes = [
  // MyPageLayout/PhotoManageLayout 하위는 route handle로 헤더를 제어한다
  {
    path: "edit-info",
    Component: EditInfoPage,
    handle: h({ title: "내정보 수정", isTab: true }),
  },
  // handle 타입: { title?, isTab?, showBack?, hideHeader? }
];

const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, element: <Navigate to="/auth/login" /> },
      { path: "auth", children: authRoutes },
      ...photoLabStandaloneRoutes, // 단독 라우트
      { Component: FooterLayout, children: footerRoutes }, // 5탭 그룹
      { path: "mypage", element: <MyPageLayout />, children: mypageRoutes },
    ],
  },
]);
```

### 1.2 새 라우트 추가 절차

1. `src/pages/{feature}/{Name}Page.tsx` 작성 (named or default export — 기존 파일 스타일 따른다)
2. `src/router/Router.tsx`에서 import + 알맞은 도메인 라우트 배열에 추가 (MyPage/PhotoManage 하위면 `handle`로 헤더 타이틀 지정 — 기존 패턴 따름)
3. TabBar 5탭에 새 항목을 추가하려면 `src/components/common/TabBar.tsx` 도 같이 수정

### 1.3 레이아웃 선택

- **`RootLayout`** — 모든 페이지의 기본 래퍼. safe-area inset, max-width 480px 모바일 컨테이너.
- **`FooterLayout`** — 하단 TabBar 5탭. 메인 네비 페이지(홈/현상소/사진수다/인화/마이) 만 안에 둔다.
- **`MyPageLayout`** — 마이페이지 플로우 전용 헤더/네비.
- **`PhotoManageLayout`** — 인화 워크플로우 전용 (8단계 페이지 묶음).

### 1.4 네비게이션·파라미터

```tsx
import {
  useNavigate,
  useParams,
  useSearchParams,
  Link,
  NavLink,
} from "react-router";

const navigate = useNavigate();
navigate("/photolab-list");
navigate(-1); // 뒤로 가기

const { id } = useParams(); // /photolab/:id

const [searchParams, setSearchParams] = useSearchParams();
const region = searchParams.get("region");
setSearchParams({ region: "seoul", page: "2" });
```

### 1.5 보호된 라우트 (도입 시)

현재는 페이지에서 `useAuthStore`로 직접 체크하거나 모달을 띄우는 방식.
공통 가드가 필요해지면:

```tsx
// src/components/common/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "@/store/useAuth.store";

export const ProtectedRoute = () => {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};
```

`Router.tsx`에서 그룹으로 묶어 사용.

### 1.6 Lazy Loading (도입 시)

초기 번들이 무거워지면 `lazy: () => import(...)` 패턴 도입 — 현재는 아직 필요 없음.

---

## 2. 폼 — 현재 패턴 + 향후 도입 가이드

### 2.1 현재 패턴 (라이브러리 없이)

이 프로젝트는 **React Hook Form / Zod를 아직 도입하지 않았다.**
간단한 입력은 `useState` + 제어 입력 + `utils/isValidText.ts` 같은 헬퍼로 처리한다.

```tsx
// 간단한 폼 예시
import { isValidText } from "@/utils/isValidText";
import { CTA_Button } from "@/components/common";

export function NicknameForm({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState("");
  const valid = isValidText(value, 2, 12);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onSubmit(value.trim());
      }}
    >
      <label htmlFor="nickname">닉네임</label>
      <input
        id="nickname"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={!valid && value.length > 0}
      />
      {!valid && value.length > 0 && (
        <span role="alert">2~12자로 입력해주세요</span>
      )}
      <CTA_Button text="확인" size="xlarge" color="orange" disabled={!valid} />
    </form>
  );
}
```

### 2.2 폼이 복잡해질 때 도입 고려 사항

다단계 입력, 비동기 검증, 여러 조건부 필드가 얽히기 시작하면 RHF + Zod 도입을 논의한다.
그 전에 **이 프로젝트의 단순한 검증 유틸로 충분한지 먼저 확인** (Karpathy 0.2 — Simplicity First).

만약 도입한다면:

1. `pnpm add react-hook-form zod @hookform/resolvers`
2. 스키마는 `src/types/{feature}/schemas/{name}.schema.ts`에 배치 (Domain).
3. 폼 컴포넌트는 `src/components/{feature}/`에 배치 (Presentation).
4. 기존 단순 폼은 그대로 두고, 새 복잡한 폼부터 적용 (Karpathy 0.3 — Surgical Changes).

```ts
// 예시 — 도입 시
import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
```

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  type LoginFormData,
} from "@/types/auth/schemas/login.schema";

export const LoginForm = ({
  onSubmit,
}: {
  onSubmit: (d: LoginFormData) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">이메일</label>
      <input
        id="email"
        type="email"
        aria-invalid={!!errors.email}
        {...register("email")}
      />
      {errors.email && <span role="alert">{errors.email.message}</span>}
      {/* ... */}
    </form>
  );
};
```

---

## 3. HTTP 클라이언트 — axiosInstance + ApiResponse 래퍼

### 3.1 단일 axios 인스턴스

**모든 HTTP 호출은 `src/lib/axiosInstance.ts` 하나만 사용한다.** 새 axios 인스턴스를 만들지 않는다.

```ts
// src/lib/axiosInstance.ts (실제 코드)
import axios from "axios";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL as string | undefined;

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // 인증 쿠키
  headers: { "Content-Type": "application/json" },
});
```

인터셉터(토큰 첨부, 401 처리)는 `src/lib/setUpInterceptors.ts`에 정의되어 있고 `main.tsx`에서 등록한다. 토큰은 `utils/tokenStorage.ts` 경유(비동기 — 웹/네이티브 저장소 분기).

### 3.2 API 함수 컨벤션

```ts
// src/apis/{feature}/{name}.api.ts
import { axiosInstance } from "@/lib/axiosInstance";
import type { ApiResponse } from "@/types/common/apiResponse";

export async function getResource(params: Params): Promise<ApiResponse<Data>> {
  const res = await axiosInstance.get<ApiResponse<Data>>("/endpoint", {
    params,
  });
  if (!res.data.success) throw new Error(res.data.message);
  return res.data;
}
```

규칙:

- 함수형, **클래스 금지** (`HttpXxxRepository` 패턴은 이 프로젝트에선 사용하지 않는다).
- 모든 응답은 `ApiResponse<T>` (`success` / `message` / `data`) 래퍼.
- `!success`면 `throw new Error(message)` — TanStack Query가 이를 `error` 상태로 변환.
- 페이지네이션 응답은 `PagedApiResponse<T>` (`pagination.{ page, hasNext, ... }`).
- 배열 쿼리 파라미터는 콤마 join 후 전송 (`apis/photoLab/photoLab.api.ts`의 `serializeListParams` 참고).
- `feature/index.ts` barrel로 외부 노출 API 제어.

### 3.3 ApiResponse 타입 (실제 코드)

```ts
// src/types/common/apiResponse.ts
export interface ApiResponse<T> {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
  data: T;
}

// 페이지네이션: pagination.{page, size, totalElements, totalPages, first, last, hasNext, hasPrevious}
export type ApiResponseWithPagination<T> = ApiResponse<T> & {
  pagination: Pagination;
};

// 슬라이스(무한스크롤): slice.{page, size, first, hasNext, hasPrevious}
export type ApiResponseWithSlice<T> = ApiResponse<T> & { slice: Slice };
```

주의: `types/photoLab.ts`에 같은 역할의 `PagedApiResponse`가 feature 로컬로 중복 존재한다 — 새 코드는 common 타입을 쓰고, 기존 photoLab 코드는 고치려 들지 말 것 (Karpathy 0.3).

또한 **서버 ID는 전부 TSID → JSON string** (`photoLabId: string` 등). 응답 타입 정의 시 number로 선언하지 않는다.

### 3.4 에러 처리 패턴

- API 함수: `throw new Error(body.message)` 정도. 추가 컨텍스트가 필요하면 `ApiError` 같은 사용자 정의 에러 도입 논의.
- 훅 (Query): `error` 상태를 반환 — 컴포넌트가 조건부 렌더.
- 훅 (Mutation): `onError`로 토스트 표시 (`ToastMessage` 컴포넌트).
- 401: 인터셉터가 `/auth/reissue`로 accessToken 자동 재발급 후 원요청 재시도한다 (중복 refresh 방지 큐 포함 — `lib/setUpInterceptors.ts`). 재발급까지 실패하면 토큰 클리어. **개별 API/훅에서 401을 따로 처리하지 않는다.**

### 3.5 파일 업로드 (presigned URL 패턴)

이 프로젝트는 직접 multipart 업로드 대신 **presigned URL** 패턴을 쓴다:

1. `apis/file/presignedUrl.api.ts` → presigned URL 발급
2. `apis/file/fileUpload.api.ts` → 발급된 URL에 직접 PUT
3. 업로드 후 키만 백엔드에 등록

`utils/pickPresignedUrl.ts`, `utils/presigned.ts` 헬퍼 참고.

---

## 4. 데이터 흐름 정리

```
[사용자 인터랙션]
       │
       ▼
[Presentation]  Component → useState/RHF → handleSubmit
       │
       ▼
[Application]  useMutation/useQuery (hooks/{feature}/)
       │
       ▼
[Infrastructure]  apis/{feature}/{name}.api.ts → axiosInstance.post(...)
       │
       ▼
[Infrastructure]  if (!success) throw → Query가 error 상태로 변환
       │
       ▼
[Presentation]  Mutation onSuccess → invalidateQueries → 캐시 refetch → UI 자동 업데이트
```

레이어별 책임 요약 (이 프로젝트):

| 레이어                                                      | 도구                           | 역할                       |
| ----------------------------------------------------------- | ------------------------------ | -------------------------- |
| Domain (`types/`, `constants/`)                             | TS 타입 (+ Zod 도입 시 스키마) | 도메인 타입·상수·검증 규칙 |
| Application (`hooks/`)                                      | TanStack Query                 | Use Case (조회/변경 흐름)  |
| Infrastructure (`apis/`, `lib/`)                            | axios + ApiResponse 래퍼       | HTTP 통신, 401 처리        |
| Presentation (`pages/`, `components/`, `store/`, `router/`) | React, Zustand, Router         | UI, 전역 UI 상태, 라우팅   |
