import { ChevronLeftIcon } from "@/assets/icon";
import { NavLink } from "react-router";
import { resolveProfileSrc } from "@/utils/resolveProfileSrc";

interface InfoBarProps {
  name: string | undefined;
  nickname: string | undefined;
  profile: string | undefined;
}

export const InfoBar = ({ name, nickname, profile }: InfoBarProps) => {
  const src = resolveProfileSrc({ raw: profile });
  return (
    <div className="mb-[1rem] flex items-center gap-3">
      {/* 프로필 이미지 */}
      <div className="h-[3.75rem] w-[3.75rem] overflow-hidden rounded-full">
        <img
          src={src}
          alt="프로필 이미지"
          draggable={false}
          className="h-full w-full object-cover"
        />
      </div>
      {/* 이름 / 닉네임 */}
      <div className="flex flex-1 flex-col text-neutral-100">
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
