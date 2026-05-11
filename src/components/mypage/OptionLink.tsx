import { ChevronLeftIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";
import { Link } from "react-router";

export const OptionLink = ({
  to,
  text,
  info,
  infoColor,
  Icon,
  onClick,
}: OptionLinkItem) => {
  const infoColorClass =
    infoColor === "gray" ? "text-neutral-500" : "text-orange-500";
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex w-full items-center gap-2 py-2.5"
    >
      {Icon && <Icon className="h-[1.125rem] w-[1.125rem]" />}
      <div className="flex flex-1 justify-between">
        <p>{text}</p>
        {info ? (
          <p className={`${infoColorClass} font-semibold`}>{info}</p>
        ) : null}
      </div>
      <ChevronLeftIcon className="h-[1.25rem] w-[1.25rem] rotate-180 font-bold text-neutral-600" />
    </Link>
  );
};
