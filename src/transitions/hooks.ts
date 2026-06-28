// transitions-dev 모션 시스템의 헤드리스 로직. transitions.css(.t-reveal 엔진 + 토큰)와 짝.
// 반환 props를 직접 마크업에 spread. 로직은 원본 hooks.js와 동일, 타입만 추가.

import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";

export type RevealState = "closed" | "open" | "closing";

// transitions.css의 reveal variant 목록. variant 추가 = CSS 규칙 1개 + 여기 멤버 1개.
export type RevealVariant =
  | "fade"
  | "scale"
  | "modal"
  | "dropdown"
  | "popover"
  | "tooltip"
  | "panel"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "sheet-bottom"
  | "sheet-top"
  | "sheet-left"
  | "sheet-right"
  | "ios-snappy"
  | "ios-bouncy"
  | "ios-zoom"
  | "ios-sheet"
  | "push-ios"
  // Finders 전용
  | "toast"
  | "banner-roll"
  | "intro-fade"
  | "carousel";

// CSS 시간값("250ms"/"0.4s")을 ms 숫자로. el 주면 그 요소 기준, 없으면 :root.
export function cssMs(
  name: string,
  fallback = 200,
  el?: Element | null,
): number {
  if (typeof document === "undefined") return fallback;
  const target = el || document.documentElement;
  const raw = getComputedStyle(target).getPropertyValue(name).trim();
  if (!raw) return fallback;
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return fallback;
  return raw.endsWith("ms") ? n : n * 1000; // "0.4s" -> 400
}

type ExitTransitionOptions = {
  ref?: RefObject<HTMLElement | null>;
  exitMs?: number;
  exitVar?: string;
  fallback?: number;
};

// mount→enter→exit→unmount 상태머신(closed/open/closing). exit 시간만큼 hold 후 unmount.
export function useExitTransition(
  open: boolean,
  {
    ref,
    exitMs,
    exitVar = "--reveal-exit",
    fallback = 200,
  }: ExitTransitionOptions = {},
): { mounted: boolean; state: RevealState } {
  const [mounted, setMounted] = useState(open);
  const [state, setState] = useState<RevealState>(open ? "open" : "closed");

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setState("open")),
      );
      return () => cancelAnimationFrame(id);
    }
    if (!mounted) return;
    setState("closing");
    const ms = exitMs ?? cssMs(exitVar, fallback, ref?.current);
    const id = window.setTimeout(() => {
      setMounted(false);
      setState("closed");
    }, ms);
    return () => window.clearTimeout(id);
  }, [open]);

  return { mounted, state };
}

type RevealOptions = { variant?: RevealVariant; exitMs?: number };
type RevealPropsInput<T extends HTMLElement> = HTMLAttributes<T> & {
  className?: string;
};

// 헤드리스 reveal. getRevealProps()를 원하는 엘리먼트에 spread.
// element 타입 제네릭(기본 HTMLDivElement) — div 외엔 useReveal<HTMLButtonElement>(...)로 지정.
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  open: boolean,
  { variant = "scale", exitMs }: RevealOptions = {},
) {
  const ref = useRef<T | null>(null);
  const { mounted, state } = useExitTransition(open, { ref, exitMs });

  const getRevealProps = (props: RevealPropsInput<T> = {}) => {
    const { className = "", ...rest } = props;
    return {
      ref,
      "data-variant": variant,
      "data-state": mounted ? state : ("closed" as RevealState),
      className: ("t-reveal " + className).trim(),
      ...rest,
    };
  };

  return { mounted, state, ref, getRevealProps };
}

// 바깥 pointerdown(capture) + Esc로 닫기. enabled에 open을 넘기면 열려있을 때만 리스너 부착.
export function useDismiss(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [ref, onDismiss, enabled]);
}

// 마우스/트랙패드 같은 fine hover 포인터일 때만 true. 터치에서 hover 끼임 방지.
export function useHoverCapable(): boolean {
  const [can, setCan] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCan(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return can;
}

type SwipeDismissOptions = {
  from?: "bottom" | "top" | "left" | "right";
  threshold?: number;
  velocity?: number;
  rubberBand?: number;
  settleVar?: string;
  settleMsVar?: string;
};

type SwipeDragProps = {
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
  style: CSSProperties;
};

// 시트/드로어 드래그-투-디스미스(iOS 제스처). 손가락 추적 + 역방향 러버밴드 +
// 거리/속도 판정으로 dismiss 또는 복귀(스프링). reduced-motion이면 드래그 비활성.
export function useSwipeDismiss(
  ref: RefObject<HTMLElement | null>,
  onDismiss: () => void,
  opts: SwipeDismissOptions = {},
): {
  dragging: boolean;
  getDragProps: (props?: { style?: CSSProperties }) => Partial<SwipeDragProps>;
} {
  const {
    from = "bottom",
    threshold = 0.4,
    velocity = 0.5,
    rubberBand = 0.55,
    settleVar = "--ease-ios-snappy",
    settleMsVar = "--duration-medium",
  } = opts;

  const [dragging, setDragging] = useState(false);
  const st = useRef<{
    id: number | null;
    start: number;
    last: number;
    lastT: number;
    vel: number;
  }>({ id: null, start: 0, last: 0, lastT: 0, vel: 0 });

  const axis = from === "left" || from === "right" ? "x" : "y";
  const dir = from === "bottom" || from === "right" ? 1 : -1; // sign that means "toward dismissal"

  const reduced =
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    // No live drag under reduced motion; fall back to button close.
    return { dragging: false, getDragProps: () => ({}) };
  }

  const pos = (e: ReactPointerEvent) => (axis === "x" ? e.clientX : e.clientY);
  const size = () => {
    const el = ref.current;
    if (!el) return 1;
    const r = el.getBoundingClientRect();
    return axis === "x" ? r.width : r.height;
  };
  const setTransform = (px: number) => {
    const el = ref.current;
    if (el)
      el.style.transform =
        axis === "x" ? `translateX(${px}px)` : `translateY(${px}px)`;
  };

  const onPointerDown = (e: ReactPointerEvent) => {
    const el = ref.current;
    if (!el) return;
    st.current = {
      id: e.pointerId,
      start: pos(e),
      last: pos(e),
      lastT: e.timeStamp,
      vel: 0,
    };
    el.setPointerCapture?.(e.pointerId);
    el.style.transition = "none";
    el.style.willChange = "transform";
    setDragging(true);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (st.current.id !== e.pointerId) return;
    const p = pos(e);
    const dt = e.timeStamp - st.current.lastT;
    if (dt > 0) st.current.vel = (p - st.current.last) / dt; // px/ms (signed)
    st.current.last = p;
    st.current.lastT = e.timeStamp;

    const raw = (p - st.current.start) * dir; // >0 = toward dismissal
    let moved: number;
    if (raw >= 0) {
      moved = raw; // free along the dismiss direction
    } else {
      const x = -raw;
      const d = size();
      moved = -((x * d * rubberBand) / (d + rubberBand * x)); // Apple rubber-band
    }
    setTransform(moved * dir);
  };

  const settle = (toPx: number, after?: () => void) => {
    const el = ref.current;
    if (!el) {
      after?.();
      return;
    }
    const ease =
      getComputedStyle(el).getPropertyValue(settleVar).trim() || "ease-out";
    const ms = cssMs(settleMsVar, 350, el);
    el.style.transition = `transform ${ms}ms ${ease}`;
    setTransform(toPx);
    const done = () => {
      el.removeEventListener("transitionend", done);
      el.style.willChange = "";
      after?.();
    };
    el.addEventListener("transitionend", done);
  };

  const end = (e: ReactPointerEvent) => {
    if (st.current.id !== e.pointerId) return;
    st.current.id = null;
    setDragging(false);

    const raw = (pos(e) - st.current.start) * dir; // distance toward dismissal
    const velToward = st.current.vel * dir; // px/ms toward dismissal
    const dismiss = raw > threshold * size() || velToward > velocity;

    if (dismiss) {
      settle(size() * dir, () => {
        const el = ref.current;
        if (el) {
          el.style.transition = "";
          el.style.transform = "";
        }
        onDismiss();
      });
    } else {
      settle(0, () => {
        const el = ref.current;
        if (el) {
          el.style.transition = "";
          el.style.transform = "";
        }
      });
    }
  };

  const getDragProps = (
    props: { style?: CSSProperties } = {},
  ): Partial<SwipeDragProps> => ({
    onPointerDown,
    onPointerMove,
    onPointerUp: end,
    onPointerCancel: end,
    style: {
      touchAction: axis === "x" ? "pan-y" : "pan-x",
      ...(props.style || {}),
    },
    ...props,
  });

  return { dragging, getDragProps };
}
