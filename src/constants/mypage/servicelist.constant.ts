import {
  BookMarkEmptyIcon,
  ChatSquareIcon,
  HeadsetIcon,
  MapPinIcon,
  TicketIcon,
} from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/, ", text: "티켓 충전", Icon: TicketIcon },
  { to: "/, ", text: "예약 관리", Icon: BookMarkEmptyIcon },
  { to: "/, ", text: "배송 주소 관리", Icon: MapPinIcon },
];

export const servicelist: OptionLinkItem[] = [
  { to: "/, ", text: "공지사항", Icon: HeadsetIcon },
  { to: "/, ", text: "1:1 문의 게시판", Icon: ChatSquareIcon },
  { to: "/, ", text: "개인정보 처리방침", Icon: ChatSquareIcon },
];
