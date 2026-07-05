import { KakaoIcon } from "@/assets/icon";

interface KakaoButtonProps {
  onClick?: () => void;
}
export const KakaoButton = ({ onClick }: KakaoButtonProps) => {
  return (
    <button
      type="button"
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] font-semibold text-neutral-900 shadow-sm active:scale-[0.99]"
      onClick={onClick}
    >
      <KakaoIcon className="h-5.5 w-5.5" />
      <span className="leading-[126%] tracking-[-0.01875rem]">
        카카오로 계속하기
      </span>
    </button>
  );
};
