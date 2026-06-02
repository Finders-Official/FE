// import { KakaoButton } from "@/components/auth";
// import { CTA_Button } from "@/components/common";
// import { Link, useNavigate, useSearchParams } from "react-router";
// import { useEffect, useMemo, useState } from "react";
// import { buildKakaoAuthorizeUrl } from "@/utils/auth/kakaoOauth";
// import { useLoginIntroUi } from "@/hooks/auth/login";
// import { useAuthStore } from "@/store/useAuth.store";
// import { Capacitor3KakaoLogin } from "capacitor3-kakao-login";

// const WELCOME_NONCE_SHOWN_KEY = "finders:welcomeNonceShown";
// const WELCOME_ONCE_FALLBACK_KEY = "finders:welcomeOnceShown";

// export function LoginPage() {
//   const [sp, setSp] = useSearchParams();

//   const nickname = useAuthStore((s) => s.user?.nickname);

//   const welcome = sp.get("welcome") === "1";
//   const nonce = sp.get("nonce");

//   //이번 요청에서 welcome을 보여줘야 하는지(세션스토리지 기준)
//   const shouldForceNow = useMemo(() => {
//     if (!welcome) return false;
//     if (typeof window === "undefined") return false;

//     if (nonce) {
//       const shownNonce = sessionStorage.getItem(WELCOME_NONCE_SHOWN_KEY);
//       return shownNonce !== nonce;
//     }

//     const shown = sessionStorage.getItem(WELCOME_ONCE_FALLBACK_KEY) === "1";
//     return !shown;
//   }, [welcome, nonce]);

//   // 핵심: ref 없이 "초기값으로만" latch (렌더 중 ref 접근 금지 룰 회피)
//   const [forceWelcomeOnce] = useState<boolean>(() => shouldForceNow);

//   // latch가 true인 케이스에서만: 기록 + URL 정리
//   useEffect(() => {
//     if (!forceWelcomeOnce) return;
//     if (typeof window === "undefined") return;

//     if (nonce) sessionStorage.setItem(WELCOME_NONCE_SHOWN_KEY, nonce);
//     else sessionStorage.setItem(WELCOME_ONCE_FALLBACK_KEY, "1");

//     setSp(
//       (prev) => {
//         const next = new URLSearchParams(prev);
//         next.delete("welcome");
//         next.delete("nonce");
//         return next;
//       },
//       { replace: true },
//     );
//   }, [forceWelcomeOnce, nonce, setSp]);

//   const ui = useLoginIntroUi({
//     forceWelcomeOnce,
//     splashMs: 2000,
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isNativeApp()) {
//       const nativeAppKey = import.meta.env.VITE_PUBLIC_KAKAO_NATIVE_APP_KEY;
//       if (nativeAppKey) {
//         Capacitor3KakaoLogin.initializeKakao({
//           app_key: nativeAppKey,
//           web_key: "",
//         })
//           .then(() => console.log("카카오 플러그인 초기화 완료!"))
//           .catch((error) => console.error("카카오 초기화 실패:", error));
//       }
//     }
//   }, []);
//   //TODO: 백엔드 -> 액세스 토큰 요청 + 리다이렉 설정
//   const handleKakaoLogin = async () => {
//     if (isNativeApp()) {
//       // 📱 [모바일 앱 환경]
//       try {
//         const result = await Capacitor3KakaoLogin.kakaoLogin();
//         const accessToken = result.value;

//         // 1. 백엔드로 토큰을 보내서 우리 서비스의 세션/로그인 처리를 합니다.
//         const response = await loginWithKakaoAppToken(accessToken);

//         // 2. 콜백 페이지(useKakaoOauth 훅)에서 했던 것과 동일한 라우팅 분기 처리
//         if (response.isNewMember) {
//           navigate("/auth/onboarding", { replace: true });
//         } else {
//           const redirect = consumeRedirectAfterLogin();
//           navigate(redirect ?? "/mainpage", { replace: true });
//         }
//       } catch (error) {
//         console.error("앱 카카오 로그인/API 실패:", error);
//         navigate("/auth/login", { replace: true });
//       }
//     } else {
//       // 💻 [일반 웹 환경] 기존 로직 그대로!
//       const url = buildKakaoAuthorizeUrl();
//       window.location.assign(url);
//       // (이후 과정은 기존 KakaoCallbackPage가 알아서 처리함)
//     }
//   };

//   //화면 정책
//   //1.mode=welcome : 축하 화면만
//   //2.mode=normal & isSplash=true : "뷰파인더..." 문구만 2초
//   //3.mode=normal & isSplash=false : 버튼(카카오/둘러보기)
//   const showWelcome = ui.mode === "welcome";
//   const showSplash = ui.mode === "normal" && ui.isSplash;
//   const showLogin = ui.mode === "normal" && !ui.isSplash;

//   return (
//     <main className="flex w-full flex-1 flex-col items-center">
//       <header
//         className={`mt-60 flex flex-col items-center text-center ${ui.headerAnim}`}
//       >
//         <img
//           src="/MainLogo.svg"
//           alt="Main Logo"
//           className="h-28 w-42 sm:h-32 sm:w-46"
//         />

//         <div key={ui.headerKey}>
//           {showWelcome ? (
//             <div className={ui.headerAnim}>
//               <p className="mt-3 text-[1.375rem] font-bold">
//                 회원가입을 축하드려요!
//               </p>
//               <p className="text-md mt-2 text-neutral-400">
//                 뷰파인더 너머 {nickname}님의 취향을 찾아보세요
//               </p>
//             </div>
//           ) : showSplash ? (
//             <div className={ui.taglineAnim}>
//               <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold sm:text-[3rem]">
//                 Finders
//               </p>
//             </div>
//           ) : (
//             <div>
//               <p className="font-ydestreet mt-3 text-[2.5rem] leading-none font-extrabold sm:text-[3rem]">
//                 Finders
//               </p>
//               <p className="text-md mt-2 text-neutral-100 sm:text-base">
//                 뷰파인더 너머, 취향을 찾다
//               </p>
//             </div>
//           )}
//         </div>
//       </header>

//       <footer
//         className={`mt-auto w-full py-5 ${showWelcome ? "border-neutral-850 border-t" : ""}`}
//       >
//         {showWelcome ? (
//           <div
//             key={ui.footerKey}
//             className={`mx-auto flex w-full max-w-sm ${ui.footerAnim}`}
//           >
//             <CTA_Button
//               text="홈으로"
//               link="/mainpage"
//               color="orange"
//               size="compact"
//             />
//           </div>
//         ) : showSplash ? (
//           <div
//             key={ui.footerKey}
//             className={`mx-auto mb-10 flex w-full max-w-sm justify-center ${ui.footerAnim}`}
//           >
//             <p className="text-md mt-2 text-neutral-100 sm:text-base">
//               뷰파인더 너머, 취향을 찾다
//             </p>
//           </div>
//         ) : showLogin ? (
//           <section
//             key={ui.footerKey}
//             className={`mx-auto max-w-sm ${ui.footerAnim}`}
//           >
//             <div className="flex flex-col gap-2">
//               <KakaoButton onClick={handleKakaoLogin} />
//             </div>

//             <Link
//               to="/mainpage"
//               className="mt-3 flex flex-col text-center text-sm font-medium text-neutral-200 underline underline-offset-2 active:scale-[0.99]"
//             >
//               로그인 없이 둘러보기
//             </Link>
//           </section>
//         ) : null}
//       </footer>
//     </main>
//   );
// }
