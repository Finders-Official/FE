import {
  BookmarkIcon,
  ChatBubbleDoubleFillIcon,
  HeadsetIcon,
  MapPinFillIcon,
  TicketFillIcon,
} from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/, ", text: "티켓 충전", Icon: TicketFillIcon },
  { to: "/, ", text: "예약 관리", Icon: BookmarkIcon },
  { to: "/, ", text: "배송 주소 관리", Icon: MapPinFillIcon },
];

export const servicelist: OptionLinkItem[] = [
  { to: "/, ", text: "공지사항", Icon: HeadsetIcon },
  { to: "/, ", text: "1:1 문의 게시판", Icon: ChatBubbleDoubleFillIcon },
];
