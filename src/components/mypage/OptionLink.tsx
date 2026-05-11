import { ChevronLeftIcon } from "@/assets/icon";
import type { OptionLinkItem } from "@/types/mypage/optionlink";
import { Link } from "react-router";

export const OptionLink = ({
  to,
  text,
  info,
  infoColor,
  Icon,
  onClick,
}: OptionLinkItem) => {
  const infoColorClass =
    infoColor === "gray" ? "text-neutral-500" : "text-orange-500";

  // 공통 스타일을 변수로 관리
  const commonClass = "flex w-full items-center gap-2 py-2.5 text-left";

  // 내부 콘텐츠
  const Content = (
    <>
      {Icon && <Icon className="h-[1.125rem] w-[1.125rem]" />}
      <div className="flex flex-1 justify-between">
        <p>{text}</p>
        {info ? <p className={`${infoColorClass}`}>{info}</p> : null}
      </div>
      <ChevronLeftIcon className="h-[1.25rem] w-[1.25rem] rotate-180 font-bold text-neutral-600" />
    </>
  );

  // 'to'가 있으면 Link, 없으면 button 렌더링
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={commonClass}>
        {Content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={commonClass}>
      {Content}
    </button>
  );
};
