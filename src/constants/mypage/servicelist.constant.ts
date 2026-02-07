import { SecurityIcon, TicketIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/ticket-charge, ", text: "티켓 충전", Icon: TicketIcon },
  { to: "/privacy, ", text: "예약 관리", Icon: SecurityIcon },
];
