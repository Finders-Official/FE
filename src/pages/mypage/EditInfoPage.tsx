import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";

export function EditInfoPage() {
  const { member, roleData } = info;
  return (
    <div>
      <header className="border-neutral-875 flex flex-col items-center justify-center gap-3 border-b-[0.4rem] pt-8 pb-6">
        <div className="border-radius-100 h-[5rem] w-[5rem] rounded-full border border-orange-400"></div>
        <button className="text-orange-500">사진 수정</button>
      </header>
      <main className="py-1">
        <OptionLink
          to="./nickname"
          text="닉네임"
          info={roleData.user?.nickname}
          infoColor="gray"
        />
        <div className="flex justify-between p-4">
          <p>이름</p>
          <p className="mr-8 text-neutral-500">{member.name}</p>
        </div>
        <OptionLink
          to="./phone"
          text="연락처"
          info={member.phone}
          infoColor="gray"
        />
        <OptionLink
          to="./social"
          text="연동된 소셜 계정"
          info="카카오톡"
          infoColor="gray"
        />
        <button className="p-4">로그아웃</button>
      </main>
    </div>
  );
}
