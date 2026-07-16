import type { ButtonHTMLAttributes } from "react";
import { Press } from "@/components/common";
type ActionButtonProps = {
  text: string;
  disabled: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({
  text,
  disabled,
  ...rest
}: ActionButtonProps) => {
  const bgClass = !disabled ? "bg-orange-500" : "bg-neutral-850";
  return (
    <Press
      {...rest}
      className={`mt-auto h-[3.25rem] w-[5.25rem] rounded-lg ${bgClass}`}
      disabled={disabled}
    >
      {text}
    </Press>
  );
};
