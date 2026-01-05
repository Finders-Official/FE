import { useNavigate } from "react-router";

type CapsuleSize = "small" | "medium";

interface CapsuleButtonProps {
  text: string;
  image: string; // 아이콘 이미지 경로
  link?: string;
  size: CapsuleSize;
  onClick?: () => void;
  className?: string;
}

export const CapsuleButton = ({
  text,
  image,
  link,
  size,
  onClick,
  className = "",
}: CapsuleButtonProps) => {
  const router = useNavigate();

  const baseClass =
    "inline-flex items-center justify-center rounded-[50px] border border-transparent transition-all duration-200 active:scale-[0.99] bg-neutral-900 text-white hover:bg-neutral-800";

  const sizeClass: Record<CapsuleSize, string> = {
    small:
      "w-[141px] h-[57px] gap-[8px] text-[16px] font-semibold drop-shadow-[0_6px_20px_rgba(238,114,68,0.5)]",

    medium:
      "w-[212px] h-[57px] gap-[8px] text-[16px] font-semibold drop-shadow-[0_6px_20px_rgba(238,114,68,0.5)]",
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
    >
      <img src={image} alt="" className="h-6 w-6 object-contain" />
      <span>{text}</span>
    </button>
  );
};
