import { InputForm } from "@/components/auth";
import { CTA_Button } from "@/components/common";
import { useOnBoardingForm } from "@/hooks/auth/onBoarding";
import { useEditMe, useMe } from "@/hooks/member";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";

export function NickNameEditPage() {
  const navigate = useNavigate();

  const { data: meData } = useMe();
  const currentNickname = meData?.roleData.user?.nickname ?? "";

  const f = useOnBoardingForm();

  const didInit = useRef(false);
  const touchedRef = useRef(false);

  //최초 1회: 현재 닉네임으로 폼 초기화
  useEffect(() => {
    if (didInit.current) return;
    if (!currentNickname) return;

    f.setNickname(currentNickname);
    touchedRef.current = false;
    didInit.current = true;
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

  const nextTrimmed = useMemo(
    () => (f.nicknameTrimmed ?? "").trim(),
    [f.nicknameTrimmed],
  );

  const isChanged = useMemo(() => {
    return nextTrimmed.length > 0 && nextTrimmed !== currentNickname;
  }, [nextTrimmed, currentNickname]);

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

  const ctaText = useMemo(() => {
    if (isEditing) return "변경 중...";
    if (touchedRef.current && nextTrimmed.length > 0 && f.isCheckingNickname)
      return "확인 중...";
    return "변경 완료";
  }, [isEditing, nextTrimmed.length, f.isCheckingNickname]);

  const handleSubmit = () => {
    if (!canEdit) return;
    edit({ nickname: nextTrimmed });
  };

  //초기 상태(현재 닉네임이 들어있고, 아직 사용자가 안 건드린 상태)
  const isInitialSame = !touchedRef.current && nextTrimmed === currentNickname;

  const helperText = isInitialSame
    ? "변경할 닉네임을 입력해 주세요"
    : f.nicknameStatusText || "닉네임을 입력해 주세요";

  const helperTextClass = isInitialSame
    ? "text-neutral-200"
    : f.nicknameTextClass;
  const helperBorderClass = isInitialSame ? undefined : f.nicknameBorderClass;

  return (
    <div className="flex h-full flex-1 flex-col">
      <form className="py-6">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
          value={f.nickname}
          invalidText={helperText}
          onChange={(e) => {
            if (!touchedRef.current) touchedRef.current = true;
            f.setNickname(e.target.value);
          }}
          borderClass={helperBorderClass}
          textClass={helperTextClass}
        />
      </form>

      <footer className="border-neutral-850 mt-auto border-t py-5">
        <CTA_Button
          size="xlarge"
          text={ctaText}
          color={color}
          disabled={!canEdit}
          onClick={handleSubmit}
        />
      </footer>
    </div>
  );
}
