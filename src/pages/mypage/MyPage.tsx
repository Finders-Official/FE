import { useCallback, useMemo, useState } from "react";

import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { InfoBar } from "@/components/mypage/InfoBar";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { managelist } from "@/constants/mypage/servicelist.constant";
import { useMe } from "@/hooks/member";

const MIDNIGHT_POPUP_STORAGE_KEY = "mypage:midnight-credit-popup:lastShownDate";

/** KST(Asia/Seoul) 기준 YYYY-MM-DD */
function getKstDateKey(d: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const y = parts.find((p) => p.type === "year")?.value ?? "0000";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  const day = parts.find((p) => p.type === "day")?.value ?? "00";
  return `${y}-${m}-${day}`;
}

function getShouldOpenMidnightDialog(todayKstKey: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const lastShown = window.localStorage.getItem(MIDNIGHT_POPUP_STORAGE_KEY);
    return lastShown !== todayKstKey;
  } catch {
    // localStorage 접근 불가면 이번 세션에서는 안 띄우는 정책
    return false;
  }
}

export function MyPage() {
  const { data: me, isLoading } = useMe();

  const todayKstKey = useMemo(() => getKstDateKey(), []);

  const [isMidnightDialogOpen, setIsMidnightDialogOpen] = useState<boolean>(
    () => getShouldOpenMidnightDialog(todayKstKey),
  );

  // 로딩중에는 닫기
  const isDialogOpen = !isLoading && isMidnightDialogOpen;

  const handleConfirmMidnightDialog = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(MIDNIGHT_POPUP_STORAGE_KEY, todayKstKey);
      } catch {
        // 저장 실패해도 닫기만은 진행
      }
    }
    setIsMidnightDialogOpen(false);
  }, [todayKstKey]);

  return (
    <div className="relative">
      <header className="rounded-tl-lg rounded-tr-lg bg-orange-500 p-[1rem]">
        <InfoBar
          name={me?.member.name}
          nickname={me?.roleData.user?.nickname}
          profile={me?.roleData?.user?.profileImage}
        />
        <MyPageTabs />
      </header>

      <main>
        <section className="py-4">
          {managelist.map((item) => (
            <OptionLink
              key={item.text}
              {...item}
              info={
                item.text === "티켓 충전"
                  ? `${me?.roleData.user?.creditBalance ?? 0}개`
                  : undefined
              }
            />
          ))}
        </section>
      </main>

      <LoadingSpinner open={isLoading} />

      <DialogBox
        title="매일 밤 자정, 무료 크레딧이 찾아와요!"
        description="매일 자정 1개의 무료 크레딧을 지급해 드리고 있어요.(크레딧 최대 보유개수: 5개)"
        isOpen={isDialogOpen}
        align="left"
        confirmText="확인"
        confirmButtonStyle="text"
        onConfirm={handleConfirmMidnightDialog}
      />
    </div>
  );
}
