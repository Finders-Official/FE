import { useEffect, useMemo, useRef, useState } from "react";

const SPLASH_PLAYED_KEY = "finders:loginSplashPlayed"; // 세션당 1회 스플래시

type Mode = "normal" | "welcome"; // 처음 진입 시 or 회원가입 완료 시

type UiState = {
  mode: Mode;
  isSplash: boolean;
  shouldAnimate: boolean;
};

type Options = {
  forceWelcomeOnce?: boolean; // welcome=1로 들어온 "이번 1회" 축하 연출 강제
  splashMs?: number; // 기본 2000ms
};

export function useLoginIntroUi(options?: Options) {
  const forceWelcomeOnce = options?.forceWelcomeOnce ?? false;
  const splashMs = options?.splashMs ?? 2000;

  const timerRef = useRef<number | null>(null);

  const [ui, setUi] = useState<UiState>(() => {
    if (typeof window === "undefined") {
      return { mode: "normal", isSplash: false, shouldAnimate: false };
    }

    // 회원가입 완료 진입: 스플래시 생략 -> 회원가입 축하 애니메이션만
    if (forceWelcomeOnce) {
      return { mode: "welcome", isSplash: false, shouldAnimate: true };
    }

    //일반 진입: 세션당 1회 스플래시
    const played = sessionStorage.getItem(SPLASH_PLAYED_KEY) === "1";
    if (!played) {
      return { mode: "normal", isSplash: true, shouldAnimate: true };
    }

    return { mode: "normal", isSplash: false, shouldAnimate: true };
  });

  const { mode, isSplash, shouldAnimate } = ui;

  //normal 스플래시를 세션당 1회로 기록 + 2초 후 종료
  useEffect(() => {
    if (mode !== "normal") return;
    if (!isSplash) return;

    sessionStorage.setItem(SPLASH_PLAYED_KEY, "1");

    timerRef.current = window.setTimeout(() => {
      setUi((prev) => ({ ...prev, isSplash: false }));
    }, splashMs);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [mode, isSplash, splashMs]);

  //key를 phase마다 바꿔서 애니메이션이 한번만 자연스럽게 재생되게
  const headerKey = useMemo(() => {
    if (mode === "welcome") return "welcome-header";
    return isSplash ? "splash-header" : "login-header";
  }, [mode, isSplash]);

  const footerKey = useMemo(() => {
    if (mode === "welcome") return "welcome-footer";
    return isSplash ? "splash-footer" : "login-footer";
  }, [mode, isSplash]);

  // 애니메이션 클래스
  const headerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const taglineAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const footerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  //TODO: 하나의 애니메이션으로 묶기

  return {
    mode,
    isSplash,
    shouldAnimate,
    headerKey,
    footerKey,
    headerAnim,
    taglineAnim,
    footerAnim,
  };
}
