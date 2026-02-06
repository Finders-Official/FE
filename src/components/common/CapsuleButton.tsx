import { useNavigate } from "react-router";
import type { ComponentType, SVGProps } from "react";

type CapsuleSize = "small" | "medium";

interface CapsuleButtonProps {
  text: string;
  image: ComponentType<SVGProps<SVGSVGElement>>;
  link?: string;
  size: CapsuleSize;
  onClick?: () => void;
  className?: string;
}

export const CapsuleButton = ({
  text,
  image: Icon,
  link,
  size,
  onClick,
  className = "",
}: CapsuleButtonProps) => {
  const router = useNavigate();

  const borderGradient =
    "linear-gradient(139.21deg, rgba(172, 157, 157, 0.215) 0%, rgba(255, 255, 255, 0.5) 103.3%)";

  const backgroundColor = "var(--color-neutral-900)";

  const baseClass =
    "inline-flex items-center justify-center rounded-[3.125rem] border border-transparent text-white transition-all duration-200 active:scale-[0.98] hover:brightness-110 h-[3.5625rem] px-[1.75rem] py-[1rem] gap-[0.5rem] text-[1rem] font-semibold";

  const sizeClass: Record<CapsuleSize, string> = {
    small: "w-[8.8125rem]",
    medium: "w-[13.25rem]",
  };

  const handleClick = () => {
    if (link) router(link);
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      className={`${baseClass} ${sizeClass[size]} ${className}`}
      onClick={handleClick}
      style={{
        background: `
          linear-gradient(${backgroundColor}, ${backgroundColor}) padding-box,
          ${borderGradient} border-box
        `,
        border: "1px solid transparent",
      }}
    >
      <Icon className="h-6 w-6" />
      <span className="whitespace-nowrap">{text}</span>
    </button>
  );
};
