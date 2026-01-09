import { ChevronLeftIcon } from "@/assets/icon";
import type { IconComponent } from "@/types/icon";

import { NavLink } from "react-router";

type OptionLinkProps = {
  to: string;
  text: string;
  Icon?: IconComponent;
};

export const OptionLink = ({ to, text, Icon }: OptionLinkProps) => {
  return (
    <NavLink
      to={to}
      className="flex h-[4rem] w-full items-center gap-3 px-[1rem]"
    >
      {Icon && <Icon className="h-[1rem] w-[1.125rem]" />}
      <p className="flex-1">{text}</p>
      <ChevronLeftIcon className="h-[1.25rem] w-[1.25rem] rotate-180" />
    </NavLink>
  );
};
