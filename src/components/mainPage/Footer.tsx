import { FindersLogoFooterIcon } from "@/assets/icon";
import { Link } from "react-router";

const BUSINESS_INFO = [
  { label: "사업자 등록번호", value: "781-46-01300" },
  { label: "연락처", value: "finders.official.kr@gmail.com" },
  {
    label: "사업장 주소",
    value: "서울특별시 동작구 상도로47바길 22, 301호(상도1동, 펠리체)",
  },
  { label: "대표자명", value: "최서연" },
  { label: "통신판매신고번호", value: "0000" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-neutral-875 flex flex-col gap-6 px-4 py-10">
      <FindersLogoFooterIcon className="h-5.75 w-50 text-neutral-700" />

      <div className="flex gap-3 text-xs leading-[1.26] font-semibold tracking-[-0.24px] text-neutral-300">
        <Link to="/auth/terms#service">이용약관</Link>
        <Link to="/auth/terms#privacy">개인정보처리방침</Link>
      </div>

      <dl className="flex flex-col gap-1 text-xs leading-[1.26] tracking-[-0.24px] text-neutral-500">
        {BUSINESS_INFO.map(({ label, value }) => (
          <div key={label} className="flex gap-4.5">
            <dt className="w-21 shrink-0">{label}</dt>
            <dd className="min-w-0">{value}</dd>
          </div>
        ))}
      </dl>
    </footer>
  );
}
