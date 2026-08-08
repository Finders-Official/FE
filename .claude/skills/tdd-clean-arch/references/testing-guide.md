# 테스팅 가이드 (Vitest + React Testing Library) — Finders Web

## 목차

0. 프로젝트 셋업 (도입 완료 — 셋업 참고용)
1. 테스트 작성 패턴
2. 커스텀 훅 테스트
3. 비동기 테스트
4. 모킹 패턴
5. TanStack Query 테스트
6. Zustand 스토어 테스트
7. 안티 패턴

---

## 0. 프로젝트 셋업

> **게이트**: `package.json`의 devDependencies에 `vitest`가 **없으면 이 문서 전체를 무시한다.** 사용자가 "테스트 써줘"라고 명시적으로 요청하지 않는 한, 테스트 파일을 만들지 않고 테스트 관련 코드를 추가하지 않는다.
>
> 사용자가 테스트 인프라 도입을 요청한 경우에만 아래 0.1~0.4를 따른다. 도입은 별도 PR로 진행 (Karpathy 0.3 — Surgical Changes).

### 0.1 의존성 설치

```bash
pnpm add -D vitest jsdom \
  @testing-library/react @testing-library/dom \
  @testing-library/jest-dom @testing-library/user-event
```

### 0.2 vite.config.ts에 test 설정 추가

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), svgr(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
```

### 0.3 src/test/setup.ts

```ts
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

afterEach(() => {
  cleanup();
});
```

### 0.4 package.json scripts

```jsonc
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
  },
}
```

### 0.5 (선택) MSW 도입은 별도 결정

이 프로젝트는 아직 MSW를 쓰지 않는다. 대부분의 경우 의존성 주입/함수 모킹으로 충분하다.
통합 테스트가 필요해질 때 도입을 별도 논의 (Karpathy 0.2 — Simplicity First).

---

## 1. 테스트 작성 패턴

### 1.1 쿼리 우선순위 (반드시 준수)

```ts
// 1순위: 접근성 역할 기반 (가장 권장)
screen.getByRole("button", { name: /확인/i });
screen.getByRole("heading", { level: 2 });
screen.getByRole("textbox", { name: /닉네임/i });

// 2순위: 라벨 기반
screen.getByLabelText(/비밀번호/i);

// 3순위: 텍스트 기반
screen.getByText(/예약하기/i);

// 4순위: data-testid (다른 방법이 없을 때만)
screen.getByTestId("custom-dropdown");
```

### 1.2 userEvent 패턴 (fireEvent 금지)

```ts
import userEvent from "@testing-library/user-event";

it("닉네임을 입력하고 저장한다", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<NicknameForm onSubmit={onSubmit} />);

  await user.type(screen.getByRole("textbox", { name: /닉네임/i }), "민수");
  await user.click(screen.getByRole("button", { name: /확인/i }));

  expect(onSubmit).toHaveBeenCalledWith("민수");
});
```

### 1.3 describe/it 구조 (한국어 it 권장 — 이 프로젝트 톤)

```ts
describe("NicknameForm", () => {
  const onSubmit = vi.fn();
  beforeEach(() => vi.clearAllMocks());

  describe("렌더링", () => {
    it("닉네임 입력 필드를 표시한다", () => {
      render(<NicknameForm onSubmit={onSubmit} />);
      expect(screen.getByRole("textbox", { name: /닉네임/i })).toBeInTheDocument();
    });
  });

  describe("검증", () => {
    it("2자 미만이면 확인 버튼이 비활성화된다", async () => {
      const user = userEvent.setup();
      render(<NicknameForm onSubmit={onSubmit} />);
      await user.type(screen.getByRole("textbox", { name: /닉네임/i }), "a");
      expect(screen.getByRole("button", { name: /확인/i })).toBeDisabled();
    });
  });
});
```

---

## 2. 커스텀 훅 테스트

### 2.1 단순 훅

```ts
import { renderHook, act } from "@testing-library/react";
import { useRecentSearches } from "@/hooks/common/useRecentSearches";

describe("useRecentSearches", () => {
  beforeEach(() => localStorage.clear());

  it("검색어를 추가하면 최신순으로 정렬된다", () => {
    const { result } = renderHook(() => useRecentSearches());

    act(() => {
      result.current.addSearch("hello");
      result.current.addSearch("world");
    });

    expect(result.current.searches[0]).toBe("world");
  });
});
```

### 2.2 TanStack Query 훅 — Provider 래퍼 필요

```ts
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

it("현상소 목록을 가져온다", async () => {
  // getPhotoLabList를 모킹한 상태에서 (5번 섹션 참고)
  const { result } = renderHook(() => usePhotoLabList({}), {
    wrapper: createWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.pages[0].data.length).toBeGreaterThan(0);
});
```

---

## 3. 비동기 테스트

### 3.1 waitFor

```ts
it("API 호출 후 결과를 표시한다", async () => {
  render(<PhotoLabList />);

  expect(screen.getByText(/로딩 중/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/필름 현상소/i)).toBeInTheDocument();
  });

  expect(screen.queryByText(/로딩 중/i)).not.toBeInTheDocument();
});
```

### 3.2 findBy (waitFor + getBy 축약)

```ts
const firstLab = await screen.findByText(/필름 현상소/i);
expect(firstLab).toBeInTheDocument();
```

---

## 4. 모킹 패턴

### 4.1 API 함수 모킹 (이 프로젝트의 기본 패턴)

이 프로젝트는 `apis/{feature}/*.api.ts`가 단순 함수이므로 함수 모킹이 직관적이다:

```ts
import * as photoLabApi from "@/apis/photoLab";

vi.mock("@/apis/photoLab", async (importOriginal) => {
  const actual = await importOriginal<typeof photoLabApi>();
  return {
    ...actual,
    getPhotoLabList: vi.fn(),
  };
});

// 실제 ApiResponse 형태에 맞춘 목 헬퍼 (code/timestamp 포함)
const pagedOk = <T>(data: T) => ({
  success: true,
  code: "OK",
  message: "ok",
  timestamp: new Date().toISOString(),
  data,
  pagination: {
    page: 0,
    size: 20,
    totalElements: 1,
    totalPages: 1,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
  },
});

it("리스트를 받아온다", async () => {
  vi.mocked(photoLabApi.getPhotoLabList).mockResolvedValue(
    pagedOk([
      /* SimplePhotoLabItem[] */
    ]),
  );
  // ...
});
```

### 4.2 axiosInstance 모킹 (Infrastructure 단위 테스트)

```ts
vi.mock("@/lib/axiosInstance", () => ({
  axiosInstance: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));
```

### 4.3 의존성 주입 패턴 (선택)

복잡한 훅을 테스트하기 쉽게 만들고 싶다면, API 함수를 인자로 받게 설계할 수 있다.
다만 **현재 컨벤션은 직접 import** — 함수 모킹으로 충분하니 무리하게 도입하지 않는다 (Karpathy 0.2).

---

## 5. TanStack Query 테스트

### 5.1 Query 훅

```ts
import { vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import * as photoLabApi from "@/apis/photoLab";
import { usePhotoLabList } from "@/hooks/photoLab/usePhotoLabList";

vi.mock("@/apis/photoLab");

describe("usePhotoLabList", () => {
  it("정상 응답 시 isSuccess가 true가 된다", async () => {
    vi.mocked(photoLabApi.getPhotoLabList).mockResolvedValue(pagedOk([])); // 4.1의 목 헬퍼

    const { result } = renderHook(() => usePhotoLabList({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it("API 실패 시 isError가 true가 된다", async () => {
    vi.mocked(photoLabApi.getPhotoLabList).mockRejectedValue(
      new Error("서버 오류"),
    );

    const { result } = renderHook(() => usePhotoLabList({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe("서버 오류");
  });
});
```

### 5.2 Mutation 캐시 무효화

```ts
it("성공 시 photoLab/list 캐시를 무효화한다", async () => {
  const queryClient = new QueryClient();
  const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
  vi.mocked(photoLabApi.addFavorite).mockResolvedValue({
    success: true, code: "OK", message: "", timestamp: "", data: undefined,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const { result } = renderHook(() => useFavoriteToggle(), { wrapper });

  await act(async () => {
    await result.current.mutateAsync({ labId: 1, isFavorite: false });
  });

  expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["photoLab", "list"] });
});
```

---

## 6. Zustand 스토어 테스트

### 6.1 스토어 단위 테스트

```ts
import { useAuthStore } from "@/store/useAuth.store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null });
    localStorage.removeItem("finders-auth");
  });

  it("setUser 호출 시 user를 업데이트한다", () => {
    useAuthStore.getState().setUser({ memberId: 1, nickname: "민수" });
    expect(useAuthStore.getState().user).toEqual({
      memberId: 1,
      nickname: "민수",
    });
  });

  it("clearUser 호출 시 user와 영속 스토리지를 모두 비운다", () => {
    useAuthStore.getState().setUser({ memberId: 1, nickname: "민수" });
    useAuthStore.getState().clearUser();

    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem("finders-auth")).toBeNull();
  });
});
```

### 6.2 컴포넌트와 함께

```ts
it("로그인 상태이면 닉네임을 표시한다", () => {
  useAuthStore.setState({ user: { memberId: 1, nickname: "민수" } });
  render(<MyPageHeader />);
  expect(screen.getByText(/민수님/i)).toBeInTheDocument();
});
```

---

## 7. 안티 패턴

```ts
// ❌ 구현 세부사항 테스트 (state 자체를 검증)
const { result } = renderHook(() => useState(false));
act(() => result.current[1](true));
expect(result.current[0]).toBe(true);

// ❌ fireEvent
fireEvent.click(button);

// ❌ data-testid 남용
screen.getByTestId("submit-button");

// ❌ 스냅샷 의존
expect(container).toMatchSnapshot();

// ❌ 하드코딩된 타이머
await new Promise((r) => setTimeout(r, 1000));

// ❌ 한 it()에 여러 시나리오 묶기
it("여러가지 동작", async () => {
  /* 클릭, 입력, 제출, 검증 다 묶기 */
});
```

```ts
// ✅ 행위 테스트
it("확인 버튼 클릭 시 onSubmit이 호출된다", async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<NicknameForm onSubmit={onSubmit} />);
  await user.type(screen.getByRole("textbox", { name: /닉네임/i }), "민수");
  await user.click(screen.getByRole("button", { name: /확인/i }));
  expect(onSubmit).toHaveBeenCalledWith("민수");
});

// ✅ userEvent + 접근성 쿼리
// ✅ waitFor / findBy
// ✅ 한 it() 한 행위
```

---

## 8. 테스트 우선순위 (이 프로젝트 기준 — 어디부터 쓸 것인가)

테스트 인프라 도입 직후, 어디부터 테스트를 채울지:

1. **`utils/*` 순수 함수** — 가장 빨리, 가장 큰 효과 (formatPhoneKorea, calendar, dateFormat 등)
2. **`apis/{feature}/*.api.ts`의 mapper·serializer 로직** — 응답/요청 변환 검증
3. **`hooks/{feature}/use*.ts`** — Query/Mutation의 성공/실패/캐시 무효화 경로
4. **`store/*.store.ts`의 분기 있는 setter** (예: `useAuth.store.ts`의 `clearUser`)
5. **`components/common/`의 인터랙션 컴포넌트** — DialogBox, BottomSheet, CTA_Button 등
6. **`pages/`의 인터랙션 페이지** — 폼 제출 흐름, 다단계 인화 워크플로우 등 (E2E 성격이 강하면 별도 도구 고려)
