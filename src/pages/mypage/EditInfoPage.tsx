import { CheckCircleIcon } from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type LocationState = { toast?: string } | null;

export function EditInfoPage() {
  const { member, roleData } = info;
  // 사진 수정 -> 전역 상태로 뺄거임
  const maxSizeMB = 5;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  //토스트 관련 값
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!state?.toast) return;
    setMessage(state.toast);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 1000);

    navigate(".", { replace: true, state: null });
  }, [state, navigate]);

  //로직 분리 예정
  const openPicker = () => {
    setError(null);
    inputRef.current?.click();
  };

  const validate = (f: File) => {
    if (!f.type.startsWith("image/")) return "이미지 파일만 선택할 수 있어요.";
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) return `최대 ${maxSizeMB}MB까지 업로드 가능해요.`;
    return null;
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = ""; // 같은 파일 다시 선택 가능하게

    if (!picked) return;

    const msg = validate(picked);
    if (msg) {
      setError(msg);
      console.log(error);
      return;
    }

    setFile(picked);
  };

  // 미리보기 URL 생성/정리
  useEffect(() => {
    if (!file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(undefined);
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="border-neutral-875 flex flex-col items-center justify-center gap-3 border-b-[0.4rem] pt-8 pb-6">
        <div className="border-radius-100 h-[5rem] w-[5rem] overflow-hidden rounded-full border border-orange-400">
          <img
            src={previewUrl}
            alt="프로필 이미지"
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>
        <button type="button" className="text-orange-500" onClick={openPicker}>
          사진 수정
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
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
      {showToast && (
        <div className="fixed bottom-[var(--tabbar-height)] ml-4 flex items-center justify-center">
          <ToastItem message={message} icon={<CheckCircleIcon />} />
        </div>
      )}
    </div>
  );
}
