import { CheckCircleIcon } from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { OptionLink } from "@/components/mypage/OptionLink";
import { info } from "@/constants/mypage/info.constant";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type LocationState = { toast?: string } | null;

export function EditInfoPage() {
  const { member, roleData } = info;
  const maxSizeMB = 5;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null); // blob 전용
  const objectUrlRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  //서버에서 온 초기 프로필 URL (string 고정)
  const serverProfileUrl = useMemo(() => {
    const url = roleData.user?.profileImage;
    return typeof url === "string" ? url : "";
  }, [roleData.user?.profileImage]);

  //실제 화면에서 쓸 src: 파일 선택 시 objectUrl, 아니면 serverProfileUrl
  const previewSrc = objectUrl ?? serverProfileUrl;

  //토스트 관련 값
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const toast = state?.toast;
    if (!toast) return;

    // ✅ effect 본문에서 setState 동기 호출 금지 룰 대응: "콜백 안에서" setState
    const showId = window.setTimeout(() => {
      setMessage(toast);
      setShowToast(true);
    }, 0);

    const id = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
      setShowToast(false);
    }, 1000);

    return () => {
      window.clearTimeout(id);
      window.clearTimeout(showId);
    };
  }, [state?.toast, navigate, location.pathname]);

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
    // ✅ 기존 objectURL 정리 (blob만)
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // ✅ objectURL은 effect에서 만들지 말고, 이벤트 핸들러에서 생성/세팅
    const url = URL.createObjectURL(picked);
    objectUrlRef.current = url;
    setObjectUrl(url);

    setFile(picked);
  };

  //objectURL 생성/정리 (blob만 revoke)
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [file]);

  return (
    <div className="flex h-full flex-1 flex-col">
      <header className="border-neutral-875 flex flex-col items-center justify-center gap-3 border-b-[0.4rem] pt-8 pb-6">
        <div className="border-radius-100 h-[5rem] w-[5rem] overflow-hidden rounded-full border border-orange-400">
          <img
            src={previewSrc}
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
      {showToast ? (
        <div className="fixed bottom-[var(--tabbar-height)] ml-4 flex animate-[finders-fade-in_500ms_ease-in-out_forwards] items-center justify-center">
          <ToastItem message={message} icon={<CheckCircleIcon />} />
        </div>
      ) : null}
    </div>
  );
}
