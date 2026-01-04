import { useNavigate } from "react-router";

type ButtonColor = "orange" | "black" | "transparent";
type ButtonSize =
  | "xsmall"
  | "small"
  | "medium"
  | "large"
  | "compact"
  | "xlarge";

interface ButtonProps {
  text: string;
  link?: string;
  size: ButtonSize;
  color: ButtonColor;
  onClick?: () => void;
}

// link 이동 시 endpoint 설정 ex link="/home"
// size: small, medium, large, xlarge, compact(로그인 화면 하단 버튼 용)
// color: orange, black 중 설정 후 사용
// onClick: 클릭 시 추가 기능 필요할 때 설정

export const Button = ({ text, link, color, size, onClick }: ButtonProps) => {
  const router = useNavigate();
  const baseClass =
    "inline-flex items-center justify-center rounded-2xl border shadow-sm active:scale-[0.99]";
  const sizeClass: Record<ButtonSize, string> = {
    xsmall: "h-[46px] w-[121px] text-[14px]",
    small: "h-[3.5rem] w-[7.5625rem]",
    medium: "h-[3.5rem] w-[10.4375rem]",
    large: "h-[3.5rem] w-[13.125rem]",
    xlarge: "h-[3.5rem] w-full",
    compact: "h-[3.125rem] w-full",
  };

  const colorClass: Record<ButtonColor, string> = {
    orange: "bg-orange-500 border-orange-200 ",
    black: "bg-neutral-900 border-neutral-500 ",
    transparent: "bg-transparent border-neutral-500",
  };

  const handleClick = () => {
    if (link) router(link);
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      className={`${baseClass} ${sizeClass[size]} ${colorClass[color]}`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};
