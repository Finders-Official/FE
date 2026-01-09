import { ChevronLeftIcon, TicketFillIcon } from "@/assets/icon";
import { MyPageTabs } from "@/components/mypage/MyPageTab";
import { OptionLink } from "@/components/mypage/OptionLink";
import { NavLink } from "react-router";

export function MyPage() {
  return (
    <div className="w-full pt-[5rem]">
      <header className="border-neutral-875 border-b-[0.4rem] p-[1rem]">
        <section className="mb-[1rem] flex items-center gap-3">
          {/* 프로필 이미지 */}
          <div className="border-radius-100 h-[3.75rem] w-[3.75rem] rounded-full border border-neutral-800"></div>
          {/* 이름 / 닉네임 */}
          <div className="flex flex-1 flex-col">
            <p className="font-light">김필름</p>
            <p className="font-normal">kimmmmmp</p>
          </div>
          {/*이동 아이콘*/}
          <NavLink to="./edit-info">
            <ChevronLeftIcon className="h-[2rem] w-[1.5rem] rotate-180" />
          </NavLink>
        </section>
        <MyPageTabs />
      </header>
      <main>
        <section className="border-neutral-875 border-b">
          <OptionLink Icon={TicketFillIcon} text="티켓 충전" to="/" />
        </section>
        <section></section>
      </main>
    </div>
  );
}
