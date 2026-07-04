---
name: tdd-clean-arch
description: >
  React + TypeScript 프론트엔드 프로젝트(Finders Web — Vite + React 19 + Tailwind 4 + TanStack Query + Zustand)에서
  Karpathy 행동 원칙 + TDD(테스트 주도 개발) + 가벼운 클린 아키텍처를 적용하여
  코드를 생성·수정·리팩토링하는 스킬.

  feature 단위 폴더링(`apis/`, `hooks/`, `components/`, `pages/`, `types/`, `constants/`, `store/`, `utils/`, `lib/`)을
  Domain/Application/Infrastructure/Presentation 레이어에 매핑하여 적용한다.

  다음 상황에서 반드시 이 스킬을 사용할 것:
  새 컴포넌트·훅·유틸리티·페이지를 생성할 때, 기존 코드를 리팩토링할 때,
  테스트를 작성하거나 수정할 때, 상태 관리 로직을 추가할 때,
  API 연동 코드를 작성할 때, 라우팅 구조를 설계할 때,
  폼/밸리데이션 로직을 구현할 때,
  "TDD", "테스트 먼저", "클린 아키텍처", "레이어 분리", "리팩토링" 등의 키워드가 등장할 때.
  코드를 작성하는 모든 상황에서 이 스킬의 원칙을 기본값으로 적용한다.
---

# TDD + Clean Architecture Skill (Finders Web)

이 스킬은 **세 가지 층위**의 원칙을 같이 다룬다.

1. **행동 원칙 (Karpathy Guidelines)** — 코드를 쓰기 전·중·후의 사고 방식.
2. **TDD 워크플로우** — 테스트가 설계를 끈다. _(Vitest 설치되어 있을 때만 적용)_
3. **가벼운 클린 아키텍처** — 이 프로젝트의 실제 폴더 구조(`apis/hooks/components/types/...`)를 4레이어에 매핑해 의존성 방향만 지킨다.

> **실용주의**: 원칙은 지키되, 불필요한 추상화로 복잡성을 높이지 않는다. 이 프로젝트는 모바일 웹앱을 Capacitor로 감싼 하이브리드 앱(Web/Android/iOS) — 페이지/컴포넌트가 빠르게 늘어나니 과한 레이어링은 오히려 해가 된다. 프로젝트 전반 규칙(네이밍·스타일링·인증·결제·플랫폼 분기)은 CLAUDE.md가 소유한다 — 이 스킬은 아키텍처·워크플로우만 다룬다.

### 적용 전 빠른 체크

스킬 진입 시 다음을 먼저 판정:

- `package.json`의 devDependencies에 **`vitest`가 없으면** → 섹션 0(Karpathy) + 섹션 3(클린 아키텍처) + 섹션 4~7만 적용. **섹션 1(TDD) · 섹션 2(테스팅 원칙) · `references/testing-guide.md`는 전부 무시한다.** 사용자가 "테스트 써줘"라고 명시적으로 요청하지 않는 한 테스트 파일을 만들지 않는다.
- `vitest`가 있으면 → 모든 섹션 적용.

---

## 0. 행동 원칙 — Karpathy Guidelines (모든 코딩 작업에 우선 적용)

[karpathy guidelines](https://github.com/multica-ai/andrej-karpathy-skills)에서 가져온 4가지 원칙. **TDD/아키텍처 규칙보다 우선한다.**

### 0.1 Think Before Coding — 가정을 숨기지 않는다

- 가정은 명시한다. 불확실하면 묻는다.
- 해석이 여러 개면 골라서 가버리지 말고 제시한다.
- 더 단순한 길이 있으면 푸시백한다.
- 막히면 멈춘다. 무엇이 불명확한지 이름 붙이고 묻는다.

### 0.2 Simplicity First — 요청된 것만, 그 이상은 금지

- 요청 범위를 넘는 기능 추가 금지.
- 1회용 코드를 위한 추상화 금지.
- 요청되지 않은 "유연성/설정 가능성" 금지.
- 일어날 수 없는 시나리오에 대한 에러 핸들링 금지.
- 200줄 짠 게 50줄이면 충분하다면, 다시 쓴다.
- 자문: "시니어 엔지니어가 이거 오버엔지니어링이라고 할까?" → 그렇다면 단순화.

### 0.3 Surgical Changes — 닿아야 할 것만 닿는다

- 인접한 코드/주석/포맷팅을 "개선"하지 않는다.
- 깨지지 않은 것은 리팩토링하지 않는다.
- 내가 다르게 짤 것 같아도 **기존 스타일을 따른다**.
- 무관한 데드 코드가 보이면 — **말은 하되 지우지 않는다**.
- 내 변경 때문에 사용되지 않게 된 import/변수만 정리한다. 기존 데드 코드는 건드리지 않는다.
- **테스트**: 바뀐 모든 줄이 사용자 요청과 직접 연결되어 있는가?

### 0.4 Goal-Driven Execution — 검증 가능한 목표를 정의한다

작업을 검증 가능한 목표로 변환한다:

- "검증 추가" → "잘못된 입력에 대한 테스트를 쓰고 통과시킨다"
- "버그 수정" → "버그를 재현하는 테스트를 쓰고 통과시킨다"
- "X 리팩토링" → "리팩토링 전후로 같은 테스트가 통과한다"

다단계 작업은 짧은 계획 + 각 단계의 verify 기준을 명시:

```
1. [단계] → verify: [확인 방법]
2. [단계] → verify: [확인 방법]
```

---

## 1. TDD 워크플로우 — Red-Green-Refactor

> **전제**: `vitest`가 설치되어 있을 때만 이 섹션을 적용한다. 미설치면 통째로 스킵.
> 도입 가이드는 `references/testing-guide.md`의 "0. 프로젝트 셋업" 참조.

새 기능 구현 시 아래 사이클을 따른다.

### 1단계: Red — 실패하는 테스트 작성

- 구현하려는 동작을 **사용자 관점**에서 기술하는 테스트를 먼저 작성한다.
- 테스트는 구현 세부사항이 아닌 **행위(behavior)** 를 검증한다.
- 테스트 파일명: `[대상].test.ts` 또는 `[대상].test.tsx` (대상과 같은 디렉토리에 co-locate)
- 테스트가 실패하는 것을 확인한 뒤 다음 단계로 넘어간다.

### 2단계: Green — 테스트를 통과하는 최소 코드 작성

- "일단 동작하게" 만든다. 완벽한 설계나 최적화는 이 단계에서 하지 않는다.

### 3단계: Refactor — 코드 개선

- 테스트가 통과하는 상태를 유지하면서 중복 제거, 네이밍 개선, 책임 분리.
- 리팩토링 후 반드시 테스트가 여전히 통과하는지 확인한다.

### TDD 적용 범위 (이 프로젝트 기준)

| 대상                                                | TDD 적용 | 이유                                                                 |
| --------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `utils/*` 순수 함수                                 | 필수     | 격리된 입력/출력, 테스트 비용 낮음                                   |
| `hooks/**/*` 커스텀 훅 (로직 분기 있음)             | 필수     | 상태/캐시 로직 신뢰성                                                |
| `apis/**/*.api.ts` (mapper·serializer 로직 포함 시) | 권장     | 응답 변환/파라미터 직렬화 검증                                       |
| `components/**` 인터랙션 컴포넌트                   | 권장     | 사용자 행위 기반 테스트                                              |
| `components/**` 단순 표시 컴포넌트                  | 선택     | 시각 회귀에 가까움 — 생략 가능                                       |
| `store/*.store.ts` (분기 있는 setter)               | 권장     | 상태 전이 규칙 검증                                                  |
| Zod/스키마 같은 검증 로직 (도입 시)                 | 필수     | 비즈니스 규칙 — 현재 Zod 미도입, `utils/isValidText` 등 헬퍼 사용 중 |

---

## 2. 테스팅 원칙 (Vitest + React Testing Library)

> **전제**: `vitest` 미설치면 이 섹션 전체 스킵.

상세는 `references/testing-guide.md`.

### 핵심 규칙

- **행위 테스트**: 내부 구현(state, ref)이 아닌 사용자가 보고 하는 것을 테스트.
- **접근성 쿼리 우선**: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.
- **userEvent 사용**: `fireEvent` 대신 `userEvent.setup()`.
- **테스트 격리**: 각 테스트는 독립적이어야 한다.
- **모킹 최소화**: 테스트 대상을 격리하기 위해 필요한 것만 모킹한다.

### 테스트 파일 위치

같은 디렉토리에 co-locate:

```
src/hooks/photoLab/
├── usePhotoLabList.ts
└── usePhotoLabList.test.ts        ← 같은 위치

src/utils/
├── formatPhoneKorea.ts
└── formatPhoneKorea.test.ts       ← 같은 위치
```

---

## 3. 클린 아키텍처 — 이 프로젝트의 레이어 매핑

이 프로젝트는 **`features/{x}/{domain,application,...}` 구조가 아니다.**
대신 **"타입별 top-level 폴더 + feature 서브폴더"** 구조다.
각 폴더를 클린 아키텍처 레이어로 다음과 같이 매핑한다.

| 클린 아키텍처 레이어 | 이 프로젝트 위치                                                                                                                                  | 담는 것                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Domain**           | `src/types/{feature}/`, `src/constants/{feature}/`, `src/utils/` 순수 함수                                                                        | 도메인 타입·상수·비즈니스 규칙 (순수 TS)                  |
| **Application**      | `src/hooks/{feature}/`                                                                                                                            | Use Case 역할의 훅 (Query/Mutation·조합 로직)             |
| **Infrastructure**   | `src/apis/{feature}/*.api.ts`, `src/lib/*` (axiosInstance·인터셉터·billing·payment), `src/utils/tokenStorage.ts`·`platform.ts` 같은 플랫폼 어댑터 | HTTP 호출, 토큰 스토리지, 결제 브릿지, 외부 서비스 어댑터 |
| **Presentation**     | `src/components/{feature}/`, `src/pages/{feature}/`, `src/layouts/`, `src/router/`                                                                | React 컴포넌트, 페이지, 라우팅, UI 상태(Zustand `store/`) |

> `utils/`는 두 성격이 섞여 있다: 대부분은 Domain(순수 함수)이지만, `tokenStorage.ts`·`platform.ts`처럼 Capacitor/스토리지를 감싸는 파일은 Infrastructure 어댑터다. 순수 함수 utils에 플랫폼 import를 새로 끌어들이지 말 것.

상세는 `references/directory-structure.md`.

### 의존성 규칙 (Dependency Rule)

- **types/, constants/, utils/ 순수 함수** (Domain): React/TanStack/Zustand/Capacitor import 금지. 순수 TS만.
- **apis/** (Infrastructure): `types/`, `lib/axiosInstance`만 import. React/훅 import 금지.
- **hooks/** (Application): `apis/`, `types/`, `store/`, `utils/`만 import. 컴포넌트 import 금지.
- **components/, pages/** (Presentation): 모든 레이어 접근 가능. 단 **API 함수를 직접 호출하지 말고 훅을 거친다.**

### 안 좋은 예 / 좋은 예

**❌ 컴포넌트에서 API 함수 직접 호출**

```tsx
// components/photoLab/PhotoLabCard.tsx
import { getPhotoLabList } from "@/apis/photoLab";
useEffect(() => { getPhotoLabList(...).then(setData); }, []);
```

**✅ 훅을 거쳐서 사용**

```tsx
import { usePhotoLabList } from "@/hooks/photoLab/usePhotoLabList";
const { data } = usePhotoLabList(params);
```

---

## 4. 상태 관리 (Zustand v5 + TanStack Query v5)

상세는 `references/state-management.md`.

### 상태 분류 원칙

| 상태 유형            | 도구                                          | 위치                  | 예시                         |
| -------------------- | --------------------------------------------- | --------------------- | ---------------------------- |
| 서버 상태            | TanStack Query                                | `hooks/{feature}/`    | API 응답, 캐시               |
| 클라이언트 전역 상태 | Zustand                                       | `store/use*.store.ts` | 로그인 모달, 인쇄 주문, 필터 |
| 폼 상태              | `useState`/제어 입력 + `utils/isValidText` 등 | 컴포넌트 내           | 입력값, 밸리데이션           |
| URL 상태             | React Router v7                               | —                     | 쿼리 파라미터, 경로          |

### 핵심 규칙 (프로젝트 컨벤션)

- 서버 데이터를 Zustand에 복제하지 않는다. TanStack Query 캐시가 single source of truth.
- Zustand 스토어 파일명은 **`use{Name}.store.ts`** (예: `useAuth.store.ts`).
- 로컬 영속 상태는 `persist` 미들웨어 + `partialize`로 필요 부분만 저장 (`useAuth.store.ts` 참고).
- queryKey 컨벤션: `["{domain}", "{action}", ...params]` — 예: `["photoLab", "list", params]`.
- 무한스크롤은 `useInfiniteQuery` + `pagination.hasNext` 패턴 (`hooks/photoLab/usePhotoLabList.ts` 참고).

---

## 5. 라우팅, 폼, HTTP 클라이언트

React Router v7 (`createBrowserRouter`), 폼/HTTP 패턴은 `references/routing-forms-http.md`.

### 핵심 규칙 (프로젝트 컨벤션)

- 라우트는 `src/router/Router.tsx`에 모두 모은다. 레이아웃은 `<Route element={<Layout/>}>` 그룹.
- HTTP는 `src/lib/axiosInstance.ts` 하나만 사용. 새 axios 인스턴스 만들지 않는다.
- 모든 응답은 `ApiResponse<T>` (`success`/`code`/`message`/`timestamp`/`data`, `types/common/apiResponse.ts`) 래퍼. API 함수에서 `if (!body.success) throw new Error(body.message)` 체크하고 throw.
- 페이지네이션 응답은 `ApiResponseWithPagination<T>`(`pagination.hasNext`) 또는 `ApiResponseWithSlice<T>`. (`types/photoLab.ts`의 `PagedApiResponse`는 feature 로컬 중복 타입 — 새 코드는 common 것을 쓴다.)
- 폼 라이브러리는 **아직 도입되어 있지 않다** — `useState` + 제어 입력 + `utils/isValidText.ts` 같은 헬퍼 사용. RHF+Zod 도입은 한 페이지 폼 로직이 커질 때 별도 논의.

---

## 6. 코드 생성 체크리스트

새 기능 구현 시 아래 순서를 따른다 (이 프로젝트의 실제 폴더 매핑):

1. **타입 정의**: `src/types/{feature}/`에 도메인 타입 추가 (예: `PhotoLabItem`, `ReservationFormData`).
2. **상수**: 필요 시 `src/constants/{feature}/`에 enum·옵션·목데이터.
3. **API 함수**: `src/apis/{feature}/{name}.api.ts` 작성 — `ApiResponse<T>` 체크 포함.
4. **Query/Mutation 훅**: `src/hooks/{feature}/use{Name}.ts` — queryKey 컨벤션 적용.
5. **전역 상태(필요 시)**: `src/store/use{Name}.store.ts` — Zustand + 필요 시 `persist`.
6. **컴포넌트**: `src/components/{feature}/` 또는 공용이면 `src/components/common/` (+ `index.ts` barrel 갱신).
7. **페이지**: `src/pages/{feature}/{Name}Page.tsx`.
8. **라우트 연결**: `src/router/Router.tsx`에 라우트 추가.
9. **테스트**: `vitest` 설치되어 있을 때만 각 단계마다 co-located `*.test.ts(x)` 작성 (TDD). 미설치면 이 단계 스킵.

---

## 7. 코드 스타일 규칙

### TypeScript

- `any` 금지. `unknown` + 타입 가드로 좁힌다.
- **이 프로젝트는 `type`을 선호한다** (`useAuth.store.ts` 참고). 단순 객체 타입은 `type`, 컴포넌트 Props는 `interface`로 정의해도 OK (`CTA_Button.tsx` 참고 — 혼용 중).
- 함수의 반환 타입을 명시한다 (단, 컴포넌트의 JSX 반환은 제외).
- `as` 단언 대신 타입 가드(`is`, `satisfies`)를 사용한다.

### React

- 함수형 컴포넌트만 사용.
- `useEffect` 내에서 데이터 페칭하지 않는다 → TanStack Query 사용.
- 커스텀 훅으로 로직 분리, 컴포넌트는 렌더링에 집중.
- **컴포넌트 export는 named export** (`export const Xxx = ...`) — 기존 일부 default export(`Header`, `MainPage` 등)는 건드리지 말고 신규는 named로 통일.

### 네이밍 · 스타일링

**CLAUDE.md의 Naming / Styling 섹션을 따른다** (rem 변환, `@theme` 컬러, 스크롤 구조 함정 포함 — 여기 중복하지 않는다). 스킬 고유 추가분만:

| 대상        | 규칙               | 예시                      |
| ----------- | ------------------ | ------------------------- |
| 유틸 파일   | camelCase          | `formatPhoneKorea.ts`     |
| 테스트 파일 | 원본명.test.확장자 | `usePhotoLabList.test.ts` |

### Barrel export

- `src/components/common/index.ts`, `src/apis/{feature}/index.ts` 같이 **외부 인터페이스 제어 용도로만** 사용.
- 새 export 추가 시 기존 패턴 따른다.

---

## 8. 이 스킬을 적용하지 않는 경우

- 설정 파일 수정 (`vite.config.ts`, `tsconfig.json`, `eslint.config.js` 등)
- 패키지 설치 및 의존성 관리
- CI/CD 파이프라인 작성
- 문서 작성 (README, CHANGELOG, CLAUDE.md 등)
- 단순 오타·버그 수정 (아키텍처 변경 불필요한 경우 — Karpathy 0.3 "Surgical Changes" 적용)
- `android/`·`ios/` 네이티브 코드(Java/Swift/Gradle/plist) — 레이어 규칙은 `src/` 전용. 단 Karpathy 행동 원칙(섹션 0)은 여기에도 적용한다.
