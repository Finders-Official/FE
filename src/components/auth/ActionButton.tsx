import type { ButtonHTMLAttributes } from "react";
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
    <button
      {...rest}
      className={`mt-auto h-[3.25rem] w-[5.25rem] rounded-lg active:scale-[0.99] ${bgClass}`}
      disabled={disabled}
    >
      {text}
    </button>
  );
};
