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

  // 최초 1회: 현재 닉네임으로 폼 초기화
  useEffect(() => {
    if (didInit.current) return;
    if (!currentNickname) return;

    f.setNickname(currentNickname);
    didInit.current = true;

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

  // touched + 입력값 있음 + (형식불일치 OR 중복)
  const showError = useMemo(() => {
    if (!touched) return false;
    if (nextTrimmed.length === 0) return false;

    const invalidFormat = !f.nicknameValid;
    const duplicated =
      f.nicknameValid && !f.isCheckingNickname && !f.nicknameAvailable;

    return invalidFormat || duplicated;
  }, [
    touched,
    nextTrimmed,
    f.nicknameValid,
    f.nicknameAvailable,
    f.isCheckingNickname,
  ]);

  const invalidText = useMemo(() => {
    if (!touched) return "변경할 닉네임을 입력해 주세요.";
    if (nextTrimmed.length === 0) return "변경할 닉네임을 입력해 주세요.";
    if (!showError) return "사용 가능한 닉네임입니다.";
    return f.nicknameStatusText || "닉네임을 확인해 주세요.";
  }, [touched, nextTrimmed, showError, f.nicknameStatusText]);

  // cta 버튼 상태 텍스트
  const ctaText = useMemo(() => {
    if (isEditing) return "변경 중...";
    if (touched && nextTrimmed.length > 0 && f.isCheckingNickname)
      return "확인 중...";
    return "변경 완료";
  }, [isEditing, touched, nextTrimmed, f.isCheckingNickname]);

  const handleSubmit = () => {
    if (!canEdit) return;
    edit({ nickname: nextTrimmed });
  };

  return (
    <div className="flex h-full flex-1 flex-col">
      <form className="py-6">
        <InputForm
          name="닉네임"
          placeholder="2~8자, 한글, 영어, 숫자 허용"
          size="large"
          value={f.nickname}
          invalidText={invalidText}
          onChange={(e) => {
            if (!touched) setTouched(true);
            f.setNickname(e.target.value);
          }}
          borderClass={showError ? f.nicknameBorderClass : undefined}
          textClass={showError ? f.nicknameTextClass : undefined}
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
