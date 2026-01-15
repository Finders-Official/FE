import { CircleGlareFillIcon } from "@/assets/icon";
import type { IconComponent } from "@/types/icon";

interface BigButtonProps {
  title: string;
  description: string;
  icon: IconComponent;
  isSelected?: boolean;
  onClick: () => void;
}

export const BigButton = ({
  title,
  description,
  icon: Icon,
  isSelected,
  onClick,
}: BigButtonProps) => {
  return (
    <div
      onClick={onClick}
      className={[
        "bg-neutral-875 flex h-48 w-full flex-col items-center justify-center rounded-[1rem] active:scale-[0.99]",
        "border transition",
        isSelected ? "border-orange-500" : "border-transparent",
      ].join(" ")}
    >
      {/* 원 + 가운데 아이콘 */}
      <div className="relative grid h-10 w-10 place-items-center">
        <CircleGlareFillIcon className="absolute inset-0 h-10 w-10" />
        <Icon className="relative h-5 w-5" />
      </div>

      <p className="mt-3 text-[1rem]">{title}</p>
      <p className="text-[0.8125rem]">{description}</p>
    </div>
  );
};
