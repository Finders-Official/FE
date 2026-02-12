import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

const ANIMATION_MS = 150;
const CLOSE_THRESHOLD_RATIO = 0.4;

type Snap = "collapsed" | "expanded"; // "2/3" | "전체"

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  collapsedRatio?: number;
  expandedVh?: number;
  initialSnap?: Snap; // 바텀시트 처음 크기 (collapsed면 2/3에서, expanded면 전체화면으로 시작)
  sheetClassName?: string;
  isBackDrop?: boolean;
  /** true면 TabBar 위에 표시 (z-60/70), false면 TabBar 아래 (z-40) */
  overlay?: boolean;
  fixedMin?: boolean; // true면 처음 높이가 최소 높이(더 내려가지 않음)
};

// clamp 유틸
const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const getViewportH = () => window.visualViewport?.height ?? window.innerHeight;

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  collapsedRatio = 0.66,
  expandedVh = 92,
  initialSnap = "collapsed",
  sheetClassName,
  isBackDrop = true,
  overlay = false,
  fixedMin = false,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement | null>(null);

  const [snap, setSnap] = useState<Snap>(initialSnap);
  const [dragging, setDragging] = useState(false);

  // vh를 state로 관리
  const [vh, setVh] = useState(() => getViewportH());

  // 스냅별 "목표 높이(px)" (bottom 고정 + height만 바꿈)
  const { expandedH, collapsedH } = useMemo(() => {
    const exp = (vh * expandedVh) / 100;
    const col = vh * collapsedRatio;
    return { expandedH: exp, collapsedH: col };
  }, [vh, collapsedRatio, expandedVh]);

  const initialH = useMemo(() => {
    return initialSnap === "expanded" ? expandedH : collapsedH;
  }, [initialSnap, expandedH, collapsedH]);

  const [sheetH, setSheetH] = useState(() => initialH);

  // open이 false → true로 전환될 때 높이를 초기값으로 리셋
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSnap(initialSnap);
      setSheetH(initialH);
    }
  }

  // expandedH/collapsedH가 동적으로 바뀔 때 sheetH도 동기화 (드래그 중엔 제외)
  const snapTargetH = snap === "expanded" ? expandedH : collapsedH;
  const [prevSnapTargetH, setPrevSnapTargetH] = useState(snapTargetH);
  if (open && !dragging && snapTargetH !== prevSnapTargetH) {
    setPrevSnapTargetH(snapTargetH);
    const minH = fixedMin ? initialH : 0;
    setSheetH(clamp(snapTargetH, minH, expandedH));
  }

  // open 상태에서 뷰포트/키보드 등으로 높이가 바뀌면 현재 snap 기준으로 높이 보정
  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      const nextVh = getViewportH();
      setVh(nextVh);

      const nextExpandedH = (nextVh * expandedVh) / 100;
      const nextCollapsedH = nextVh * collapsedRatio;
      const nextInitialH =
        initialSnap === "expanded" ? nextExpandedH : nextCollapsedH;

      const target = snap === "expanded" ? nextExpandedH : nextCollapsedH;

      // fixedMin이면 최소 높이를 nextInitialH로 유지
      const minH = fixedMin ? nextInitialH : 0;
      setSheetH(clamp(target, minH, nextExpandedH));

      const isTyping =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement as HTMLElement | null)?.isContentEditable;

      if (isTyping && snap === "collapsed") {
        setSnap("expanded");
        setSheetH(nextExpandedH);
        return;
      }
    };

    window.visualViewport?.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, [open, snap, collapsedRatio, expandedVh, initialSnap, fixedMin]);

  // body 스크롤 잠금(인스타 느낌)
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 드래그 시작점
  const pointerState = useRef<{
    startClientY: number;
    startH: number;
  } | null>(null);

  // 드래그 시작
  const onPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pointerState.current = { startClientY: e.clientY, startH: sheetH };
    setDragging(true);
  };

  // 드래그 중
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerState.current) return;

    const { startClientY, startH } = pointerState.current;
    const delta = e.clientY - startClientY; // 아래로 +, 위로 -
    // 아래로 끌면 높이 줄고, 위로 끌면 높이 늘어남
    const minH = fixedMin ? initialH : 0;
    const nextH = clamp(startH - delta, minH, expandedH);
    setSheetH(nextH);
  };

  // 드래그 끝
  const onPointerUp = () => {
    if (!pointerState.current) return;
    pointerState.current = null;
    setDragging(false);

    // 스냅 판정
    // 0) fixedMin이면 닫기 판정 자체를 하지 않음(내려갈 수 없으니까)
    if (!fixedMin) {
      if (sheetH <= vh * CLOSE_THRESHOLD_RATIO) {
        onClose();
        return;
      }
    }

    // 1) 너무 아래로 끌면 닫기
    if (sheetH <= vh * CLOSE_THRESHOLD_RATIO) {
      onClose();
      return;
    }

    // 2) expanded/collapsed 중 가까운 쪽으로
    const baseCollapsedH = fixedMin ? initialH : collapsedH;

    const midH = (expandedH + baseCollapsedH) / 2;
    const nextSnap: Snap = sheetH >= midH ? "expanded" : "collapsed";
    setSnap(nextSnap);
    setSheetH(nextSnap === "expanded" ? expandedH : baseCollapsedH);
  };

  if (!open) return null;

  const transition = dragging ? "none" : `height ${ANIMATION_MS}ms ease`;

  return (
    <>
      {/* Backdrop */}
      {isBackDrop && (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={`fixed inset-0 bg-black/80 ${overlay ? "z-[60]" : "z-40"}`}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`fixed inset-x-0 bottom-0 ${overlay ? "z-[70]" : "z-40"}`}
        style={{
          height: `${sheetH}px`,
          transition,
        }}
      >
        <div
          className={[
            "mx-auto flex h-full w-full max-w-[32rem] flex-col rounded-t-4xl shadow-[0_-0.75rem_2.5rem_rgba(0,0,0,0.4)]",
            "bg-neutral-875",
            sheetClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {/* Handle + Header */}
          <div
            className="flex shrink-0 cursor-grab touch-none flex-col items-center gap-3 px-4 py-[0.625rem] select-none"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            <div className="mx-auto h-[0.1875rem] w-[2.5625rem] rounded-full bg-neutral-500" />
            {title && (
              <h2 className="text-[1rem] font-bold text-neutral-200">
                {title}
              </h2>
            )}
          </div>

          {/* Content 영역 */}
          <div
            className="min-h-0 flex-1"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
