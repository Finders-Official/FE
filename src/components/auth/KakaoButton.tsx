import { KakaoIcon } from "@/assets/icon";
import { Press } from "@/components/common";

interface KakaoButtonProps {
  onClick?: () => void;
}
export const KakaoButton = ({ onClick }: KakaoButtonProps) => {
  return (
    <Press
      type="button"
      className="inline-flex h-[3.125rem] w-full items-center justify-center gap-2 rounded-2xl bg-[#FEE500] font-semibold text-neutral-900 shadow-sm"
      onClick={onClick}
    >
      <KakaoIcon className="h-5.5 w-5.5" />
      <span className="leading-[126%] tracking-[-0.01875rem]">
        카카오로 계속하기
      </span>
    </Press>
  );
};
