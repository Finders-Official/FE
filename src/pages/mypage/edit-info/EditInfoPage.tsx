import { CheckCircleIcon } from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { OptionLink } from "@/components/mypage/OptionLink";
import { GCS_PUBLIC_BASE } from "@/constants/gcsUrl";
import { useLogout } from "@/hooks/auth/login";
import { useIssuePresignedUrl, useUploadToPresignedUrl } from "@/hooks/file";
import { useMe, useEditMe } from "@/hooks/member";
import { formatPhoneKorea } from "@/utils/formatPhoneKorea";
import {
  pickPresignedPutUrl,
  pickUploadedFilePublicUrlOrKey,
} from "@/utils/pickPresignedUrl";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

type LocationState = { toast?: string } | null;

// fallback 이미지
const FALLBACK_PROFILE_SRC = "/MainLogo.svg";

function resolveProfileSrc(raw: string) {
  if (!raw) return FALLBACK_PROFILE_SRC;

  // 업로드 직후 objectUrl
  if (raw.startsWith("blob:")) return raw;

  // 이미 완전한 URL
  if (/^https?:\/\//i.test(raw)) return raw;

  // 로컬 public 경로
  if (raw.startsWith("/")) return raw;

  // 스토리지 key로 보고 base 붙이기 + 인코딩(한글/공백 대응)
  const key = raw.replace(/^\/+/, "");
  return `${GCS_PUBLIC_BASE}/${encodeURI(key)}`;
}

export function EditInfoPage() {
  const { data: me, isLoading } = useMe({ refetchOnMount: "always" });

  const phone = useMemo(() => {
    const raw = me?.member?.phone;
    return raw ? formatPhoneKorea(raw) : "";
  }, [me?.member?.phone]);

  const maxSizeMB = 5;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  // 서버가 내려주는 값(키 또는 URL)
  const serverProfileUrlOrKey = useMemo(() => {
    const v = me?.roleData?.user?.profileImage;
    return typeof v === "string" ? v : "";
  }, [me?.roleData?.user?.profileImage]);

  // 우선순위: objectUrl(즉시 미리보기) > server > fallback
  const basePreviewSrc = useMemo(() => {
    if (objectUrl) return objectUrl;
    if (serverProfileUrlOrKey && serverProfileUrlOrKey.length > 0)
      return serverProfileUrlOrKey;
    return FALLBACK_PROFILE_SRC;
  }, [objectUrl, serverProfileUrlOrKey]);

  // 실제 img src (resolve 적용)
  const imgSrc = useMemo(
    () => resolveProfileSrc(basePreviewSrc),
    [basePreviewSrc],
  );

  // 토스트
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? null;
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  // 로그아웃 모달
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { mutate: doLogout, isPending: isLogoutPending } = useLogout({
    onSuccess: () => navigate("/auth/login", { replace: true }),
    onError: () => navigate("/auth/login", { replace: true }),
  });

  const handleLogout = () => setIsLogoutModalOpen(true);

  useEffect(() => {
    const toast = state?.toast;
    if (!toast) return;

    const showId = window.setTimeout(() => {
      setMessage(toast);
      setShowToast(true);
    }, 0);

    const id = window.setTimeout(() => {
      navigate(location.pathname, { replace: true, state: null });
      setShowToast(false);
    }, 2000);

    return () => {
      window.clearTimeout(id);
      window.clearTimeout(showId);
    };
  }, [state?.toast, navigate, location.pathname]);

  const openPicker = () => {
    if (isUploadingProfile) return;
    setError(null);
    inputRef.current?.click();
  };

  const validate = (f: File) => {
    if (!f.type.startsWith("image/")) return "이미지 파일만 선택할 수 있어요.";
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (f.size > maxBytes) return `최대 ${maxSizeMB}MB까지 업로드 가능해요.`;
    return null;
  };

  const { mutateAsync: issuePresignedUrl } = useIssuePresignedUrl();
  const { mutateAsync: uploadToPresignedUrl } = useUploadToPresignedUrl();

  const { mutateAsync: editMe } = useEditMe();

  const uploadProfileImage = async (picked: File) => {
    if (!me) throw new Error("내 정보가 아직 없어요.");

    const memberId = me.member?.memberId;
    if (typeof memberId !== "number")
      throw new Error("memberId를 찾을 수 없어요.");

    setIsUploadingProfile(true);

    try {
      const presigned = await issuePresignedUrl({
        category: "PROFILE",
        fileName: picked.name,
        memberId,
      });

      const putUrl = pickPresignedPutUrl(presigned.data);

      await uploadToPresignedUrl({
        url: putUrl,
        file: picked,
        contentType: picked.type || "application/octet-stream",
      });

      const publicUrlOrKey = pickUploadedFilePublicUrlOrKey(
        presigned.data,
        putUrl,
      );

      //  여기서 서버에  url 저장
      await editMe({ profileImageUrl: publicUrlOrKey });
      setError(null);
    } finally {
      setIsUploadingProfile(false);
    }
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const picked = e.target.files?.[0] ?? null;
    e.target.value = "";

    if (!picked) return;

    const msg = validate(picked);
    if (msg) {
      setError(msg);
      return;
    }

    // 기존 objectURL 정리
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    // 미리보기 세팅 (즉시 보여야 함)
    const url = URL.createObjectURL(picked);
    objectUrlRef.current = url;
    setObjectUrl(url);

    try {
      await uploadProfileImage(picked);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!objectUrlRef.current) return;
    if (!serverProfileUrlOrKey) return;

    // 서버 값이 들어왔으니 blob 미리보기 정리
    URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = null;
    setObjectUrl(null);
  }, [serverProfileUrlOrKey]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <header className="border-neutral-875 flex flex-col items-center justify-center gap-3 border-b-[0.4rem] pt-8 pb-6">
        <div className="border-radius-100 h-[5rem] w-[5rem] overflow-hidden rounded-full border border-orange-400">
          <img
            src={imgSrc}
            alt="프로필 이미지"
            draggable={false}
            className="h-full w-full object-cover"
            onError={(e) => {
              const resolvedFallback = resolveProfileSrc(FALLBACK_PROFILE_SRC);
              if (
                (e.currentTarget as HTMLImageElement).src !== resolvedFallback
              ) {
                (e.currentTarget as HTMLImageElement).src = resolvedFallback;
              }
            }}
          />
        </div>

        <button
          type="button"
          className="text-orange-500"
          onClick={openPicker}
          disabled={isUploadingProfile}
        >
          {isUploadingProfile ? "업로드 중..." : "사진 수정"}
        </button>

        {error ? (
          <p className="mt-2 text-sm text-orange-600" role="alert">
            {error}
          </p>
        ) : null}

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
          info={me?.roleData?.user?.nickname ?? ""}
          infoColor="gray"
        />

        <div className="flex justify-between p-4">
          <p>이름</p>
          <p className="mr-8 text-neutral-500">{me?.member?.name ?? ""}</p>
        </div>

        <OptionLink to="./phone" text="연락처" info={phone} infoColor="gray" />

        <OptionLink
          to="./social"
          text="연동된 소셜 계정"
          info="카카오톡"
          infoColor="gray"
        />

        <section className="flex flex-col">
          <button onClick={handleLogout} className="p-4 text-left">
            로그아웃
          </button>
          <Link to="./withdraw" className="p-4 text-left">
            탈퇴하기
          </Link>
        </section>

        <DialogBox
          isOpen={isLogoutModalOpen}
          title="로그아웃"
          description="정말로 로그아웃하시겠어요?"
          confirmText={isLogoutPending ? "로그아웃 중..." : "로그아웃"}
          onConfirm={() => doLogout()}
          cancelText="뒤로 가기"
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      </main>

      <LoadingSpinner open={isLoading} />

      {showToast ? (
        <div className="fixed bottom-[var(--tabbar-height)] ml-4 flex animate-[finders-fade-in_500ms_ease-in-out_forwards] items-center justify-center">
          <ToastItem message={message} icon={<CheckCircleIcon />} />
        </div>
      ) : null}
    </div>
  );
}
