import { InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { useState } from "react";
import { useNavigate } from "react-router";

export function NickNameEditPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const color = nickname ? "orange" : "black";

  const handleSubmit = () => {
    navigate("/mypage/edit-info", {
      replace: true,
      state: { toast: "닉네임을 변경했어요" },
    });
  };
  return (
    <div className="flex h-full flex-1 flex-col">
      <form className="py-6">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
          invalidText="잘못된 닉네임입니다."
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </form>
      <footer className="border-neutral-850 mt-auto border-t px-4 py-5">
        <CTA_Button
          size="xlarge"
          text="변경 완료"
          color={color}
          disabled={!nickname}
          onClick={handleSubmit}
        />
      </footer>
    </div>
  );
}
