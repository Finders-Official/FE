import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/mypage", text: "크레딧 개수" },
  { to: "/auth/terms#service", text: "이용 약관" },
];

export const servicelist: OptionLinkItem[] = [
  { to: "/mypage/notice", text: "공지사항" },
  { to: "/mypage", text: "이용 약관" },
  { to: "/mypage/inquiry", text: "1:1 문의 게시판" },
];
