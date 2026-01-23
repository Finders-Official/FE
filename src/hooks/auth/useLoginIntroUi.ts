import { useEffect, useRef, useState } from "react";

const SIGNED_UP_KEY = "finders:signedUp";
const ANIM_KEY = "finders:loginAnimationPlayed";

type UiState = {
  isSignedUp: boolean;
  isSplash: boolean;
  shouldAnimate: boolean;
};

export function useLoginIntroUi() {
  const timerRef = useRef<number | null>(null);

  const [ui, setUi] = useState<UiState>(() => {
    if (typeof window === "undefined") {
      return { isSignedUp: false, isSplash: false, shouldAnimate: false };
    }

    const isSignedUp = localStorage.getItem(SIGNED_UP_KEY) === "1";
    const playedAnim = sessionStorage.getItem(ANIM_KEY) === "1";

    if (isSignedUp) {
      return { isSignedUp: true, isSplash: false, shouldAnimate: false };
    }

    const shouldAnimate = !playedAnim;
    const isSplash = !playedAnim;

    return { isSignedUp: false, isSplash, shouldAnimate };
  });

  const { isSignedUp, isSplash, shouldAnimate } = ui;

  useEffect(() => {
    if (!shouldAnimate) return;
    sessionStorage.setItem(ANIM_KEY, "1");
  }, [shouldAnimate]);

  useEffect(() => {
    if (!shouldAnimate) return;
    if (!isSplash) return;

    timerRef.current = window.setTimeout(() => {
      setUi((prev) => ({ ...prev, isSplash: false }));
    }, 2000);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [isSplash, shouldAnimate]);

  // 기존 handleClick을 그대로 유지(지금은 데모용). 실제 소셜 연동 후에는 보통 제거.
  const markSignedUp = () => {
    localStorage.setItem(SIGNED_UP_KEY, "1");
    setUi((prev) => ({
      ...prev,
      isSignedUp: true,
      isSplash: false,
      shouldAnimate: prev.shouldAnimate,
    }));
  };

  const headerKey = isSignedUp
    ? "signedup-header"
    : isSplash
      ? "splash-header"
      : "login-header";

  const footerKey = isSignedUp
    ? "signedup-footer"
    : isSplash
      ? "splash-footer"
      : "login-footer";

  const headerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const taglineAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";
  const footerAnim = shouldAnimate
    ? "animate-[finders-fade-in_1500ms_ease-in-out_forwards]"
    : "";

  return {
    ui,
    isSignedUp,
    isSplash,
    shouldAnimate,
    headerKey,
    footerKey,
    headerAnim,
    taglineAnim,
    footerAnim,
    markSignedUp,
  };
}
