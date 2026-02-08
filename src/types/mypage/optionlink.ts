import type { ReactNode } from "react";
import type { IconComponent } from "../icon";

export type OptionLinkItem = {
  to: string;
  text: string;
  info?: ReactNode;
  infoColor?: "white" | "gray";
  Icon?: IconComponent;
  onClick?: () => void;
};
