import { useState } from "react";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { useHoverCapable } from "@/transitions";

type PressProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Press<T extends ElementType = "button">({
  as,
  className = "",
  children,
  ...rest
}: PressProps<T>) {
  const Component = (as ?? "button") as ElementType;
  const hover = useHoverCapable();
  const [pressed, setPressed] = useState(false);

  const touchProps = hover
    ? {}
    : {
        onPointerDown: () => setPressed(true),
        onPointerUp: () => setPressed(false),
        onPointerCancel: () => setPressed(false),
        onPointerLeave: () => setPressed(false),
      };

  return (
    <Component
      className={("t-press " + className).trim()}
      data-pressed={!hover && pressed ? "true" : undefined}
      {...touchProps}
      {...rest}
    >
      {children}
    </Component>
  );
}
