import { SecurityIcon, TicketIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/mypage", text: "크레딧 개수", Icon: TicketIcon },
  { to: "/auth/terms#service", text: "이용 약관", Icon: SecurityIcon },
];
