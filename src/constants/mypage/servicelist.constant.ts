import type { OptionLinkItem } from "@/types/mypage/optionlink";

export const managelist: OptionLinkItem[] = [
  { to: "/mypage/credit", text: "크레딧 개수" },
  { to: "/mypage/device", text: "내 장비 등록하기" },
];

export const servicelist: OptionLinkItem[] = [
  { to: "/mypage/notice", text: "공지사항" },
  { to: "/auth/terms#service", text: "이용 약관" },
  { to: "/mypage/inquiry", text: "1:1 문의 게시판" },
];
