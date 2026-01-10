import { EllipsisVerticalIcon } from "@/assets/icon";
import { useState } from "react";
import { ActionSheet } from "./ActionSheet";

type ProfileType = "post" | "comment";

interface ProfileProps {
  type: ProfileType;
  userName?: string;
  avatarUrl?: string;
  date?: string;
  time?: string;
  comment?: string;
  isOwner: boolean;
}

export default function Profile({
  type,
  userName,
  avatarUrl,
  date,
  time,
  comment,
  isOwner,
}: ProfileProps) {
  const [moreMenu, setMoreMenu] = useState(false);

  return (
    <div className="flex items-start gap-2">
      {/* avatar */}
      <img src={avatarUrl} alt={userName} className="h-9 w-9 rounded-full" />

      {/* content */}
      <div className="flex flex-1 flex-col">
        {type === "post" && (
          <>
            <p className="text-[13px] font-semibold text-neutral-200">
              {userName}
            </p>
            <p className="text-[12px] font-light text-neutral-400">{date}</p>
          </>
        )}

        {type === "comment" && (
          <>
            <div className="flex gap-1">
              <p className="text-[13px] font-semibold text-neutral-200">
                {userName}
              </p>
              <p className="text-[12px] font-light text-neutral-400">{time}</p>
            </div>
            <p className="text-[14px] font-light text-neutral-200">{comment}</p>
          </>
        )}
      </div>

      {/* owner menu icon */}
      {isOwner && (
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center"
          aria-label="더보기"
          onClick={() => {
            setMoreMenu(true);
          }}
        >
          <EllipsisVerticalIcon className="h-4 w-[3px]" />
        </button>
      )}

      {/* more menu */}
      {moreMenu && (
        <ActionSheet
          open={moreMenu}
          title=" "
          onClose={() => setMoreMenu(false)}
          actions={[
            {
              label: "공유하기",
              onClick: async () => {
                // Web Share API (모바일 브라우저에서 잘 됨)
                if (navigator.share) {
                  await navigator.share({
                    title: "파인더스",
                    text: "게시글 공유",
                    url: location.href,
                  });
                } else {
                  await navigator.clipboard.writeText(location.href);
                }
              },
            },
            {
              label: "삭제하기",
              variant: "danger",
              onClick: () => {
                // 삭제 API 호출
                console.log("delete");
              },
            },
          ]}
        />
      )}
    </div>
  );
}
