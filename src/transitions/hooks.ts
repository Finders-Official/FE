import { useEffect, useRef, useState } from "react";
import type { HTMLAttributes, RefObject } from "react";

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

  // 마운트 / 닫힘(exit) 처리
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
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

  useEffect(() => {
    if (!open || !mounted || state !== "closed") return;
    const id = requestAnimationFrame(() => setState("open"));
    return () => cancelAnimationFrame(id);
  }, [open, mounted, state]);

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
