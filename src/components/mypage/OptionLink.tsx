import { ChevronLeftIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

import { NavLink } from "react-router";

export const OptionLink = ({ to, text, info, Icon }: OptionLinkItem) => {
  return (
    <NavLink
      to={to}
      className="flex h-[4rem] w-full items-center gap-3 px-[1rem]"
    >
      {Icon && <Icon className="h-[1rem] w-[1.125rem]" />}
      <div className="flex flex-1 justify-between">
        <p>{text}</p>
        {info ? <p>{info}</p> : null}
      </div>
      <ChevronLeftIcon className="h-[1.25rem] w-[1.25rem] rotate-180" />
    </NavLink>
  );
};
