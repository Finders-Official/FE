// transitions-dev 헤드리스 훅 공개 엔트리. CSS 엔진은 src/index.css에서 1회 @import.

export {
  cssMs,
  useExitTransition,
  useReveal,
  useDismiss,
  useHoverCapable,
  useSwipeDismiss,
} from "./hooks";
export type { RevealState, RevealVariant } from "./hooks";
