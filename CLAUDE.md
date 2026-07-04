# CLAUDE.md

Finders — 필름카메라 현상소 탐색·현상/인화 주문·사진 피드 서비스.
React SPA를 **Capacitor로 감싼 하이브리드 앱** (Web + Android + iOS). 모바일 전용 UI (max-width 480px).

이 문서는 코드만 읽어서는 알 수 없는 규칙·관습·함정만 담는다. 코드에서 파생 가능한 정보는 적지 않는다.

## ⚠️ 최우선 규칙

### 1. 코드 작업 전 `tdd-clean-arch` 스킬 로드

이 레포의 `.claude/skills/tdd-clean-arch/`에 포함되어 있다. **코드 변경 도구(Edit/Write)를 쓰기 전에 Skill 도구로 먼저 호출한다.**

- 대상 작업 (예외 없음): 컴포넌트·훅·유틸·페이지·스토어의 생성/수정/리팩토링, API 함수(`apis/`)·Query 훅(`hooks/`)·Zustand 스토어(`store/`) 작업, 폼·밸리데이션·라우팅·레이아웃 변경. 사용자가 스킬을 언급하지 않아도 해당되면 자동 로드.
- 단순 질문 답변·파일 탐색·설명만 하는 경우는 스킬 없이 진행 가능.
- 스킬 사용 불가 환경이면 사용자에게 알리고 진행 여부 확인.
- 핵심 원칙 (상세는 스킬 내부): Karpathy 행동 원칙(작게 시작, 요청 범위만, 기존 스타일 유지, 불필요한 추상화 금지) · feature 폴더 → Domain/Application/Infrastructure/Presentation 레이어 매핑 · TDD는 **vitest가 설치된 경우에만** 적용(스킬이 자동 판정 — 현재 이 레포에는 vitest가 없으므로 명시 요청 없이 테스트 파일을 만들지 않는다).

### 2. 디자인은 디자이너의 몫 — 만들지도 바꾸지도 않는다

- **원래 없던 문구(카피)를 추가하지 않는다.** 에러 메시지·안내 문구·라벨을 지어내지 말 것.
- Figma가 주어지거나 사용자가 직접 요구한 경우가 아니면 기존 레이아웃·스타일을 그대로 유지한다.
- 모션 작업 시 정적 외형(모양·색·크기·문구)은 건드리지 말고 **모션만 추가**한다.
- 스켈레톤 등 새 시각 요소가 불가피하면 임의로 디자인하지 말고 먼저 사용자/디자이너에게 확인한다.

## 작업 방식 · Git

- **Claude는 git add/commit/push를 직접 하지 않는다.** 구현 + 검증(`pnpm lint`, `pnpm build`)까지 하고 멈춘다. 커밋은 개발자가 직접 한다.
- 커밋은 논리/화면 단위로 작게 쪼갠다 — 서로 다른 화면·기능을 한 커밋에 묶지 않는다. 커밋 메시지를 제안할 때도 이 단위 기준.
- PR 전 리뷰에서 발견한 문제는 **실제로 재현·검증된 것만** 수정한다. 추측성 발견으로 코드를 바꾸지 않는다.

## Commands

패키지 매니저는 **pnpm 고정** (npm/yarn 금지). pre-commit 훅(Husky + lint-staged)이 eslint --fix + prettier를 자동 실행한다.

```bash
pnpm dev              # 개발 서버
pnpm build            # tsc -b && vite build
pnpm build:dev        # --mode development 빌드 (QA/dev 서버용)
pnpm lint             # ESLint (--max-warnings 0)
pnpm lint:fix / format / format:check

pnpm cap:sync         # build 후 dist/를 android+ios 네이티브 프로젝트에 복사
pnpm cap:sync:android / cap:sync:ios       # 각 :dev 변형은 build:dev 기반
pnpm cap:open:android / cap:open:ios   # Android Studio / Xcode 열기
```

- 웹 코드 수정은 `cap:sync`를 해야 네이티브 앱에 반영된다 (`webDir: dist` 복사 방식).
- **pnpm은 `node-linker=hoisted` 고정** (`.npmrc`) — isolated 레이아웃으로 설치된 상태에서 `cap sync`를 돌리면 iOS `Podfile.lock`에 `.pnpm` 해시 경로가 박혀 다른 머신에서 깨진다(#321). Podfile.lock의 경로는 항상 `../../node_modules/{pkg}` 형태여야 정상.

## Tech Stack

React 19 · Vite 7 · TypeScript strict · Tailwind CSS 4 · React Router 7 · TanStack Query 5 · Zustand 5 · Axios · Capacitor 8 · PortOne V2 browser SDK · vite-plugin-svgr

## 디렉토리 구조

`src/` 아래 **feature-based** 폴더링. 한 feature가 모든 폴더를 갖지는 않는다 (예: `member`/`file`/`my`는 apis+hooks만 존재).

- `apis/{feature}/` — Axios 호출 함수 (`*.api.ts`)
- `hooks/{feature}/` — Query/Mutation 훅. `hooks/common/` — 공용 훅 (useInfiniteScroll, useDebounceValue, useGeolocation, useCarousel 등 — 새로 만들기 전 확인)
- `components/{feature}/`, `components/common/` — 공용 컴포넌트는 **barrel(`index.ts`) 먼저 확인** (Header, BottomSheet, DialogBox, CTA_Button, TabBar, ToastMessage, EmptyView, chips 등)
- `pages/{feature}/`, `types/{feature}/`, `constants/{feature}/`
- `store/` — Zustand 스토어 (`use{Name}.store.ts`)
- `utils/` — 공용 헬퍼 (platform.ts, tokenStorage.ts, dateFormat.ts, timeAgo.ts 등)
- `lib/` — axiosInstance, setUpInterceptors(토큰 리프레시), `billing/`(네이티브 IAP 브릿지), `payment/`(PortOne)
- `layouts/` — 아래 Layout 섹션 참고
- `router/Router.tsx` — 모든 라우트가 이 한 파일에 있음
- `android/`, `ios/` — Capacitor 네이티브 프로젝트

feature 도메인: `auth`, `mainPage`, `photoLab`(현상소), `photoFeed`(사진수다), `photoManage`(현상관리/인화), `photoRestoration`, `mypage`, `credit`, `payment`, `developmentHistory`, `filmCameraGuide`, `member`, `file`, `my`. (`pages/demoDay`는 임시 이벤트 페이지)

## Naming

| 대상            | 규칙                                       |
| --------------- | ------------------------------------------ |
| 컴포넌트 파일   | PascalCase (`Header.tsx`)                  |
| 훅 파일         | camelCase (`useRecentSearches.ts`)         |
| API 파일        | `{name}.api.ts`                            |
| 스토어 파일     | `use{Name}.store.ts`                       |
| SVG 파일        | kebab-case (`arrow-left.svg`)              |
| SVG export      | PascalCase + Icon 접미사 (`ArrowLeftIcon`) |
| 타입/인터페이스 | PascalCase                                 |
| 상수            | UPPER_SNAKE_CASE                           |

## Styling

- **크기 단위는 rem** (`px / 16 = rem`). 디자인 시안의 px 값을 그대로 적지 말 것.
- Path Alias `@/` → `src/`.
- 커스텀 컬러는 `src/index.css`의 `@theme` 블록에만 정의: `orange-100~900` + `orange-450`, `neutral-0~1000` + `neutral-{750,850,875}`. 임의 hex 직접 사용 금지.
- 글로벌 값은 `:root` CSS 변수: `--tabbar-height`, `--fab-gap`.
- prettier-plugin-tailwindcss가 클래스 순서 자동 정렬.
- 폰트: 기본 Pretendard Variable, 포인트용 `.font-ydestreet`.

### 스크롤 구조 — 함정 주의

- **실제 스크롤러는 항상 `#root`다.** RootLayout이 `min-h-dvh`(불확정 높이)라 페이지의 `h-full`이 해석되지 않는다 → 페이지 안에 `flex-1 overflow-y-auto` 내부 스크롤 컨테이너를 만들어도 오버플로가 생기지 않는 **죽은 컨테이너**가 된다. 진짜 내부 스크롤은 레이아웃 높이 체인 개편이 필요한 별도 작업.
- `100dvh` 대신 `100%` 사용 (PWA — 주소창 춤 방지, body 스크롤 안 씀).
- 고정 헤더는 `#root` 스크롤 기준 **sticky 패턴**: `<div className="sticky top-0 z-20 -mx-4 bg-neutral-900 px-4">` (`-mx-4`/`px-4`는 RootLayout의 px-4 패딩 위로 배경 확장. `PhotoLabDetailPage` 참고).
- `overscroll-behavior: none`은 body에 이미 있다. 개별 요소에 `overscroll-y-none`을 추가하지 말 것 — 오버플로 없는 컨테이너에 붙으면 휠 스크롤이 완전히 죽는다.
- (Claude 검증 팁) 브라우저 자동화(CDP)의 합성 스크롤은 가로 캐러셀(snap-x) 위에서 이벤트가 소멸한다 — 캐러셀 관련 스크롤 동작은 CDP로 판정하지 말고 사용자 실기기 확인을 요청할 것.

## SVG 아이콘

```tsx
import { ArrowLeftIcon } from "@/assets/icon";
<ArrowLeftIcon className="h-6 w-6 text-orange-500" />;
```

- SVGO가 `fill/stroke`를 `currentColor`로 변환 → `text-*`로 색상 제어. `viewBox` 유지, `width/height` 제거 → Tailwind 클래스로 사이즈 제어.
- 추가 시: `src/assets/icon/`에 kebab-case로 저장 → `index.ts`에 `export { default as XxxIcon } from "./xxx.svg?react";` 추가.
- Figma export SVG는 **수정하지 말고 그대로** 저장.

## API · TanStack Query

서버 응답은 `ApiResponse<T>` 래퍼(`success`/`message`/`data`, `@/types/common/apiResponse`). API 함수에서 `!body.success`면 throw:

```ts
// apis/{feature}/{name}.api.ts
export async function getResource(params: Params): Promise<ApiResponse<Data>> {
  const res = await axiosInstance.get<ApiResponse<Data>>("/endpoint", {
    params,
  });
  if (!res.data.success) throw new Error(res.data.message);
  return res.data;
}
```

- 무한스크롤: `useInfiniteQuery` + `pagination.hasNext` (`hooks/photoLab/usePhotoLabList` 참고).
- queryKey 컨벤션: `["{domain}", "{action}", ...params]`. 기존 키 일부는 이 규칙을 안 따르는데, 무관한 작업에서 고치려 들지 말 것.
- 배열 쿼리 파라미터는 콤마 join 후 전송 (`apis/photoLab/photoLab.api.ts` 참고).
- **서버 ID는 TSID → JSON에서 string이다** (photoLabId, regionId, productId 등). number로 파싱·선언하지 말 것. 일부 레거시 ID는 number로 남아 있지만 새 코드는 string.
- 즐겨찾기류 낙관적 업데이트 컨벤션: onMutate에서 **불리언(isFavorite)만 플립**, 카운트(favoriteCount)는 ±1 수동 계산하지 않는다 — onSettled의 invalidate로 서버 정산 (`hooks/photoLab/useFavoriteToggle` 참고).

## 인증 (Auth)

- **accessToken 저장소는 플랫폼별로 다르다**: 웹=localStorage, 네이티브=SecureStoragePlugin. 반드시 `utils/tokenStorage.ts`를 경유하고 localStorage를 직접 만지지 말 것.
- refreshToken은 **httpOnly 쿠키** (클라이언트 접근 불가). 401 → `/auth/reissue` → 원요청 재시도 + 중복 refresh 방지 큐가 `lib/setUpInterceptors.ts`에 구현되어 있다. 인증 관련 수정 전에 이 파일을 먼저 읽을 것.
- `signupToken`: 가입 미완료 사용자용 임시 토큰. accessToken 없을 때 대신 첨부되며, 401이어도 refresh 대상이 아니다.
- 소셜 로그인: 카카오(웹=redirect 방식, 네이티브=`capacitor3-kakao-login` 플러그인), 애플(`@capacitor-community/apple-sign-in`). 관련 유틸은 `utils/auth/`.

## 플랫폼 분기 · 결제

- 플랫폼 판별은 `utils/platform.ts` 헬퍼 사용 (`isAndroidApp`/`isIosApp`/`getPaymentProvider`), `utils/auth/envUtils.ts`의 `isNativeApp`.
- 결제는 하나의 PaymentPage에서 **3분기**: android=`GOOGLE_PLAY`(인앱결제), ios=`APPLE_IAP`(StoreKit2), web=`PORTONE`(웹결제). 크레딧 상품 목록은 provider 파라미터로 서버 조회.
- 네이티브 IAP: 커스텀 플러그인 `FindersBillingPlugin`(android/ios 네이티브 코드) ↔ `lib/billing/finders-billing.ts` 브릿지. 영수증 검증은 서버(`/payments/{google|apple}/verify`). **Google은 서버가 consume, Apple은 클라이언트가 finishPurchase** — 이 계약을 바꾸면 결제가 유실된다.
- PortOne: `lib/payment/portone.ts`. `paymentId`는 백엔드가 생성(사전등록 → requestPayment → complete). 모바일 웹 redirect 복귀 시 sessionStorage로 복원(`pendingPortonePayment.ts`).
- **상품 ID 불변식**: DB의 externalProductId === 스토어 콘솔(Play Console/App Store Connect) product ID === 클라가 조회하는 SKU. 하나라도 어긋나면 해당 스토어 결제가 전건 실패한다.
- verify의 `PAYMENT_410`(중복 결제)은 **성공으로 취급**한다 — 이미 지급된 구매의 재전송 케이스이므로 정상 플로우(finish 등)를 계속 진행.
- 미반영 구매 자가복구: `useReconcileGooglePurchases`/`useReconcileApplePurchases`가 미완료 구매를 재검증한다. 결제 코드 수정 시 이 경로를 깨뜨리지 말 것.
- **iOS 앱에서 PortOne(웹결제) UI가 노출되면 앱스토어 리젝 사유(가이드라인 3.1.1)** — PaymentPage 플랫폼 분기 수정 시 주의.
- 결제 E2E는 로컬 불가: Google=내부테스트 트랙 서명빌드 필요, Apple=실기기 sandbox/TestFlight (Xcode 로컬 .storekit 트랜잭션은 서버 검증이 안 됨).

## State 분리

- **서버 상태**는 TanStack Query.
- **클라이언트 전역 상태**만 Zustand: `useAuth`, `useLoginModal`, `useNewPostState`, `usePhotoLabFilter`, `usePrintOrder`, `useAddressId`, `usePaymentOrder`.
- 페이지 로컬 상태는 `useState`/`useReducer`. 굳이 store로 끌어올리지 말 것.

## Layouts

- 기본 페이지 → `RootLayout` (safe-area, max-width 480px 모바일 컨테이너).
- 5탭 메인 네비 페이지 → `FooterLayout` (TabBar. Router에서 `<Route element={<FooterLayout />}>` 그룹).
- 마이페이지 플로우 → `MyPageLayout`, 인화 플로우 → `PhotoManageLayout`.
- MyPage/PhotoManage 하위 라우트는 route `handle`(`{ title, isTab, showBack, hideHeader }`)로 헤더를 제어한다 — 새 하위 페이지 추가 시 Router.tsx의 기존 handle 패턴을 따를 것.

## Display Formatting

| Field                | Format      |
| -------------------- | ----------- |
| `distanceKm`         | `{value}km` |
| `avgWorkTimeMinutes` | `{value}분` |
| `workCount`          | `{value}건` |

## 환경 변수 (.env, 전부 `VITE_PUBLIC_` 접두사)

`API_URL` · `KAKAO_REDIRECT_URI` · `KAKAO_JS_KEY` · `KAKAO_REST_API_KEY` · `KAKAO_NATIVE_APP_KEY` · `APPLE_CLIENT_ID` · `APPLE_REDIRECT_URI` · `PORTONE_STORE_ID` · `PORTONE_CHANNEL_KEY`

## 네이티브(Capacitor) 주의사항

- ID 체계가 헷갈린다: Capacitor appId·iOS 번들ID·Android namespace는 `com.finders.app`, **Android 스토어용 applicationId만 `com.finders`** (build.gradle에서 의도적으로 분리 — `com.finders.app`은 Play에서 타 계정이 점유).
- **앱 WebView의 출처(origin)는 웹과 다르다**: Android=`https://localhost`, iOS=`capacitor://localhost`(고정 — https로 바꿀 수 없음). 백엔드 CORS가 이 두 출처를 `allowCredentials(true)`와 함께 허용해야 한다. "앱에서만 API가 403 CORS"면 십중팔구 이 문제.
- 같은 이유로 외부 리소스(카카오 지도 SDK 등)는 상대 URL(`//...`)이 깨진다 — **절대 URL(`https://`) 명시**.
- 위치정보 등 기기 권한은 웹 코드만으로 안 되고 `android/`·`ios/`의 매니페스트/plist 권한 선언이 필요하다.
- 카카오 OAuth 리다이렉트(`kakao{key}://oauth`)는 `AuthCodeHandlerActivity`의 intent-filter가 받는다 (AndroidManifest에 반영됨 — MainActivity로 옮기면 네이티브 카카오 로그인이 깨진다).
- **release 빌드는 JS `console.log`가 logcat에 안 찍힌다** (네이티브 `Log.*`만 나옴). JS 레벨 디버깅은 debug 빌드로.
- Android 서명 release 빌드: `pnpm build` → `npx cap sync android` → `android/`에서 `gradlew assembleRelease` (Play Store용 AAB는 `bundleRelease`). **Capacitor 8은 JDK 21 필요** — `invalid source release: 21` 에러는 로컬에 낮은 JDK(JAVA_HOME 또는 사용자 전역 gradle.properties)가 잡힌 것이니 `-Dorg.gradle.java.home=<JDK21 경로>`로 오버라이드. 서명 비밀정보는 `android/keystore.properties`(gitignore) — **절대 커밋 금지**.
- User-Agent에 `FindersApp`이 append되어 있음 (서버/외부 서비스에서 앱 판별용).
