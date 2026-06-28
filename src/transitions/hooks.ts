import { useEffect, useRef, useState } from "react";
import type {
  CSSProperties,
  HTMLAttributes,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";

export type RevealState = "closed" | "open" | "closing";

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
  | "toast"
  | "banner-roll"
  | "intro-fade"
  | "carousel";

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
  return raw.endsWith("ms") ? n : n * 1000;
}

type ExitTransitionOptions = {
  ref?: RefObject<HTMLElement | null>;
  exitMs?: number;
  exitVar?: string;
  fallback?: number;
};

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
  const dir = from === "bottom" || from === "right" ? 1 : -1;

  const reduced =
    typeof window !== "undefined" &&
    !!window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
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
    if (dt > 0) st.current.vel = (p - st.current.last) / dt;
    st.current.last = p;
    st.current.lastT = e.timeStamp;

    const raw = (p - st.current.start) * dir;
    let moved: number;
    if (raw >= 0) {
      moved = raw;
    } else {
      const x = -raw;
      const d = size();
      moved = -((x * d * rubberBand) / (d + rubberBand * x));
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

    const raw = (pos(e) - st.current.start) * dir;
    const velToward = st.current.vel * dir;
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
