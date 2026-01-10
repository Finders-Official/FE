import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

type SheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  collapsedRatio?: number; // default: 0.66 (2/3)
  expandedVh?: number; // default: 92vh
  initialSnap?: "collapsed" | "expanded"; // 바텀시트 처음 크기 (collapsed면 2/3에서, expanded면 전체화면으로 시작)
};

/**
 * - collapsed: 화면의 2/3 높이
 * - expanded: 화면 다 채우기
 * - dismissed: 아래로 내려서 닫힘
 */
type Snap = "collapsed" | "expanded" | "dismissed";

export default function BottomSheet({
  open,
  onClose,
  title,
  children,
  collapsedRatio = 0.66,
  expandedVh = 92,
  initialSnap = "collapsed",
}: SheetProps) {
  const [isDragging, setIsDragging] = useState(false); // UI용: 드래그 중에는 애니메이션 꺼야 함
  const [y, setY] = useState<number | null>(null); // 시트가 얼마나 아래로 내려와 있는가 (y=0이면 맨 위)

  const draggingRef = useRef(false); // 계산용: 드래그 중인지를 즉시 판단하기 위한 플래그
  const startYRef = useRef(0); // 드래그 시작할 때 손가락 y좌표
  const startTranslateRef = useRef(0); // 드래그 시작 순간의 시트 y좌표
  const lastMoveRef = useRef({ t: 0, y: 0 }); // 스와이프 속도 계산용

  const [vh, setVh] = useState(() => window.innerHeight); // 현재 실제 화면 높이(px) - 가변

  /** resize effect: 화면 높이 바뀔 때 vh 갱신 */
  useEffect(() => {
    const onResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Body Scroll Lock
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // Snap Point 계산
  // 1. 시트가 최대일 때 실제 px 높이
  const expandedHeight = useMemo(
    () => (vh * expandedVh) / 100,
    [vh, expandedVh],
  );
  // 2. 시트가 2/3만 덮는 상태의 실제 높이(px)
  const collapsedHeight = useMemo(
    () => vh * collapsedRatio,
    [vh, collapsedRatio],
  );

  // expanded 기준으로 “collapsed일 때 아래로 내려갈 translateY”
  //const yCollapsed = useMemo(
  //  () => Math.max(0, expandedHeight - collapsedHeight),
  //  [expandedHeight, collapsedHeight]
  //);

  const yExpanded = 0; // 시트를 맨 위까지 올라온 상태
  const yCollapsed = Math.max(0, expandedHeight - collapsedHeight);
  const yDismissed = expandedHeight; // 아래로 완전히 내림(시트 높이만큼)

  // 실제 화면에 쓰이는 y
  const displayY = y ?? (initialSnap === "expanded" ? yExpanded : yCollapsed);

  if (!open) return null;

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v));

  const resetInternal = () => {
    draggingRef.current = false;
    setIsDragging(false);
    setY(null);
  };

  const closeSheet = () => {
    resetInternal();
    onClose();
  };

  const animateTo = (next: Snap) => {
    if (next === "expanded") setY(yExpanded);
    if (next === "collapsed") setY(yCollapsed);
    if (next === "dismissed") {
      setY(yDismissed);
      window.setTimeout(() => onClose(), 180); // 애니메이션 끝난 뒤 close (간단히 timeout)
    }
  };

  const DRAG_START_AREA = 80; // px (상단 80px 영역은 항상 드래그 허용)

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;

    // input 영역에서는 드래그 시작 방지
    if (
      target.closest("textarea") ||
      target.closest("input") ||
      target.closest("[data-no-drag]")
    ) {
      return;
    }

    // 상단 영역에서 시작된 터치만 허용
    if (e.clientY > DRAG_START_AREA + displayY) return;

    draggingRef.current = true;
    setIsDragging(true);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);

    startYRef.current = e.clientY;
    startTranslateRef.current = displayY;
    lastMoveRef.current = { t: performance.now(), y: e.clientY };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    const dy = e.clientY - startYRef.current;
    const nextY = clamp(startTranslateRef.current + dy, 0, yDismissed);
    setY(nextY);

    // velocity 추정(최근 이동 기록)
    lastMoveRef.current = { t: performance.now(), y: e.clientY };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;

    draggingRef.current = false;
    setIsDragging(false);

    // 속도 추정: 마지막 move 기준이 너무 단순하면, 여기서 한 번 더 보정
    const now = performance.now();
    const dt = now - lastMoveRef.current.t;
    const vy = dt > 0 ? (e.clientY - lastMoveRef.current.y) / dt : 0; // px/ms

    const fastDown = vy > 0.6; // 아래로 빠르게 스와이프
    const fastUp = vy < -0.6; // 위로 빠르게 스와이프

    const currentY = displayY; // 손 뗄 때 기준 위치는 displayY

    // 1) 빠른 스와이프면 방향 우선
    if (fastUp) return animateTo("expanded");
    if (fastDown) {
      // 아래로 빠르면: 어느 정도 내려왔는지에 따라 collapsed or dismissed
      return currentY > (yCollapsed + yDismissed) / 2
        ? animateTo("dismissed")
        : animateTo("collapsed");
    }

    // 2) 느리면 “스냅 포인트” 중 가장 가까운 곳으로
    const candidates: Array<[Snap, number]> = [
      ["expanded", yExpanded],
      ["collapsed", yCollapsed],
      ["dismissed", yDismissed],
    ];

    //아래 끝까지 거의 내려간 경에만 dismissed가 가까워지게 가중치
    const nearest = candidates
      .map(([s, v]) => {
        const penalty =
          s === "dismissed" && currentY < yDismissed * 0.85 ? 9999 : 0;
        return [s, Math.abs(currentY - v) + penalty] as const;
      })
      .sort((a, b) => a[1] - b[1])[0][0];

    animateTo(nearest);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/45"
      onTouchMove={(e) => e.preventDefault()}
      onWheel={(e) => e.preventDefault()}
      onMouseDown={closeSheet}
    >
      <div
        className="bg-neutral-875 flex w-full max-w-[430px] flex-col rounded-t-[24px] p-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_40px_rgba(0,0,0,0.4)]"
        style={{
          height: `${expandedHeight}px`, // “확장 최대 높이”를 시트 실높이로
          transform: `translateY(${displayY}px)`, // 드래그는 translate로 처리
          transition: isDragging ? "none" : "transform 180ms ease",
          willChange: "transform",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header + Handle */}
        <div className="flex flex-col items-center justify-center gap-3 py-[10px]">
          {/* Handle */}
          <div className="mt-2 mb-1 h-[3px] w-[41px] touch-none rounded-full bg-neutral-500" />
          {title && (
            <h2 className="text-[16px] font-bold text-neutral-200">{title}</h2>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
