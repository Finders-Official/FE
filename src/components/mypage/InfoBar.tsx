import { ChevronLeftIcon } from "@/assets/icon";
import { NavLink } from "react-router";

interface InfoBarProps {
  name: string;
  nickname: string | undefined;
  profile?: string;
}

export const InfoBar = ({ name, nickname }: InfoBarProps) => {
  return (
    <div className="mb-[1rem] flex items-center gap-3">
      {/* 프로필 이미지 */}
      <div className="h-[3.75rem] w-[3.75rem] rounded-full border border-neutral-800"></div>
      {/* 이름 / 닉네임 */}
      <div className="flex flex-1 flex-col">
        <p className="font-light">{name}</p>
        <p className="font-normal">{nickname}</p>
      </div>
      {/*이동 아이콘*/}
      <NavLink to="./edit-info">
        <ChevronLeftIcon className="h-[2rem] w-[1.5rem] rotate-180" />
      </NavLink>
    </div>
  );
};
