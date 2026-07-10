import type {
  ComponentPropsWithoutRef,
  ElementType,
  PointerEvent,
  ReactNode,
} from "react";
import { useHoverCapable } from "@/transitions";

type PressProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

// press 피드백은 CSS(.t-press[data-pressed])가 담당한다.
// data-pressed를 React state로 두면 탭마다 서브트리가 리렌더되므로,
// 포인터 핸들러에서 DOM 속성만 직접 토글해 리렌더를 0으로 만든다.
// Press가 중첩되면(카드 안의 좋아요 버튼 등) pointerdown이 버블링되어 조상 Press까지
// 함께 축소되므로, 가장 안쪽 .t-press가 아닌 경우는 무시한다.
const press = (e: PointerEvent<Element>) => {
  const innermost = (e.target as Element).closest(".t-press");
  if (innermost !== e.currentTarget) return;
  e.currentTarget.setAttribute("data-pressed", "true");
};
const release = (e: PointerEvent<Element>) =>
  e.currentTarget.removeAttribute("data-pressed");

export function Press<T extends ElementType = "button">({
  as,
  className = "",
  children,
  ...rest
}: PressProps<T>) {
  const Component = (as ?? "button") as ElementType;
  const hover = useHoverCapable();

  const touchProps = hover
    ? {}
    : {
        onPointerDown: press,
        onPointerUp: release,
        onPointerCancel: release,
        onPointerLeave: release,
      };

  return (
    <Component
      className={("t-press " + className).trim()}
      {...touchProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
