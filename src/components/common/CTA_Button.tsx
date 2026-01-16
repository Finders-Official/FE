import type { IconComponent } from "@/types/icon";
import { useNavigate } from "react-router";

type CTA_ButtonColor = "orange" | "black" | "transparent" | "gray";
type CTA_ButtonSize =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "compact"
  | "xlarge";

interface CTA_ButtonProps {
  text: string;
  link?: string;
  size: CTA_ButtonSize;
  color: CTA_ButtonColor;
  onClick?: () => void;
  disabled?: boolean;
  icon?: IconComponent;
}

// link 이동 시 endpoint 설정 ex link="/home"
// size: xsmall, small, medium, large, xlarge, compact(로그인 화면 하단 버튼 용)
// color: orange, black 중 설정 후 사용
// onClick: 클릭 시 추가 기능 필요할 때 설정

export const CTA_Button = ({
  text,
  link,
  color,
  size,
  onClick,
  disabled = false,
  icon: Icon,
}: CTA_ButtonProps) => {
  const router = useNavigate();
  const baseClass =
    "inline-flex items-center justify-center rounded-2xl border shadow-sm active:scale-[0.99]";
  const sizeClass: Record<CTA_ButtonSize, string> = {
    xsmall: "h-[2.875rem] w-[7.5625rem] text-[0.875rem]",
    small: "h-[3.5rem] w-[7.5625rem]",
    medium: "h-[3.5rem] w-[10.4375rem]",
    large: "h-[3.5rem] w-[13.125rem]",
    xlarge: "h-[3.5rem] w-full",
    compact: "h-[3.125rem] w-full",
  };

  const colorClass: Record<CTA_ButtonColor, string> = {
    orange: "bg-orange-500 border-orange-200 ",
    black: "bg-neutral-900 border-neutral-500 ",
    transparent: "bg-transparent border-neutral-500",
    gray: "bg-neutral-850 border-neutral-850",
  };

  const disabledClass =
    "bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed";

  const handleClick = () => {
    if (disabled) return;
    if (link) router(link);
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      className={`${baseClass} ${sizeClass[size]} ${disabled ? disabledClass : colorClass[color]}`}
      onClick={handleClick}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <p>{text}</p>
    </button>
  );
};
