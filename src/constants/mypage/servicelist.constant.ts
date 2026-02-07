import { SecurityIcon, TicketIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/ticket-charge, ", text: "티켓 충전", Icon: TicketIcon },
  { to: "/auth/terms#service, ", text: "이용 약관", Icon: SecurityIcon },
];
