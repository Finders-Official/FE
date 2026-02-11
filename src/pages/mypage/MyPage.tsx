import { useState } from "react";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { InfoBar } from "@/components/mypage/InfoBar";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { managelist } from "@/constants/mypage/servicelist.constant";
import { useMe } from "@/hooks/member";

export function MyPage() {
  const { data: me, isLoading } = useMe();
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);

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
          {managelist.map((item) => {
            const isTicket = item.text === "크레딧 개수";

            return (
              <OptionLink
                key={item.text}
                {...item}
                info={
                  isTicket
                    ? `${me?.roleData.user?.creditBalance ?? 0}개`
                    : undefined
                }
                onClick={
                  isTicket ? () => setIsTicketDialogOpen(true) : item.onClick
                }
              />
            );
          })}
        </section>
      </main>

      <LoadingSpinner open={isLoading} />

      <DialogBox
        title="매일 밤 자정, 무료 크레딧이 찾아와요!"
        description="매일 자정 1개의 무료 크레딧을 지급해 드리고 있어요.(크레딧 최대 보유개수: 5개)"
        isOpen={isTicketDialogOpen}
        align="left"
        confirmText="확인"
        confirmButtonStyle="text"
        onConfirm={() => setIsTicketDialogOpen(false)}
      />
    </div>
  );
}
