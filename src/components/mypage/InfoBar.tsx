import { ChevronLeftIcon } from "@/assets/icon";
import { NavLink } from "react-router";
import { resolveProfileSrc } from "@/utils/resolveProfileSrc";
import { FALLBACK_PROFILE_SRC } from "@/constants/gcsUrl";

interface InfoBarProps {
  name: string | undefined;
  nickname: string | undefined;
  profile: string | undefined; // 서버가 주는 url 또는 key
}

export const InfoBar = ({ name, nickname, profile }: InfoBarProps) => {
  const raw =
    profile && profile.trim().length > 0 ? profile : FALLBACK_PROFILE_SRC;
  const src = resolveProfileSrc({ raw });

  return (
    <div className="mb-[1rem] flex items-center gap-3">
      <div className="h-[3.75rem] w-[3.75rem] overflow-hidden rounded-full">
        <img
          src={src}
          alt="프로필 이미지"
          draggable={false}
          className="h-full w-full object-cover"
          onError={(e) => {
            const fallback = resolveProfileSrc({ raw: FALLBACK_PROFILE_SRC });
            if (e.currentTarget.src !== fallback)
              e.currentTarget.src = fallback;
          }}
        />
      </div>

      <div className="flex flex-1 flex-col text-neutral-100">
        <p className="font-light">{name}</p>
        <p className="font-normal">{nickname}</p>
      </div>

      <NavLink to="./edit-info">
        <ChevronLeftIcon className="h-[2rem] w-[1.5rem] rotate-180" />
      </NavLink>
    </div>
  );
};
