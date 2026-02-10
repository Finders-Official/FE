import { InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { useOnBoardingForm } from "@/hooks/auth/onBoarding";
import { useEditMe, useMe } from "@/hooks/member";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";

export function NickNameEditPage() {
  const navigate = useNavigate();

  const { data: meData } = useMe();
  const currentNickname = meData?.roleData.user?.nickname ?? "";

  const f = useOnBoardingForm();
  const didInit = useRef(false);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (didInit.current) return;
    if (!currentNickname) return;

    f.setNickname(currentNickname);
    didInit.current = true;

    // effect 본문에서 setState “직접” 호출 금지 룰 대응: 콜백에서 setState
    const id = window.setTimeout(() => setTouched(false), 0);
    return () => window.clearTimeout(id);
  }, [currentNickname, f]);

  const { mutate: edit, isPending: isEditing } = useEditMe({
    onSuccess: () => {
      navigate("/mypage/edit-info", {
        replace: true,
        state: { toast: "닉네임을 변경했어요" },
      });
    },
    onError: (e) => console.error(e.message),
  });

  const isChanged = useMemo(() => {
    const next = (f.nicknameTrimmed ?? "").trim();
    return next.length > 0 && next !== currentNickname;
  }, [f.nicknameTrimmed, currentNickname]);

  const canEdit = useMemo(() => {
    return (
      isChanged &&
      f.nicknameValid &&
      f.nicknameAvailable &&
      !f.isCheckingNickname &&
      !isEditing
    );
  }, [
    isChanged,
    f.nicknameValid,
    f.nicknameAvailable,
    f.isCheckingNickname,
    isEditing,
  ]);

  const color = canEdit ? "orange" : "black";

  // 첫 진입엔 무조건 안내문, 입력 시작하면 상태문구
  const invalidText = touched
    ? f.nicknameStatusText || "변경할 닉네임을 입력해 주세요"
    : "변경할 닉네임을 입력해 주세요";

  const handleSubmit = () => {
    if (!canEdit) return;
    edit({ nickname: f.nicknameTrimmed });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <form className="py-6">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
          invalidText={invalidText}
          value={f.nickname}
          onChange={(e) => {
            if (!touched) setTouched(true);
            f.setNickname(e.target.value);
          }}
          borderClass={f.nicknameBorderClass}
          textClass={f.nicknameTextClass}
        />
      </form>

      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          size="xlarge"
          text={isEditing ? "변경 중..." : "변경 완료"}
          color={color}
          disabled={!canEdit}
          onClick={handleSubmit}
        />
      </footer>
    </div>
  );
}
