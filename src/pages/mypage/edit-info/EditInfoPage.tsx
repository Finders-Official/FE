import { CheckCircleIcon } from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { OptionLink } from "@/components/mypage/OptionLink";
import { useLogout } from "@/hooks/auth/login";
import { useIssuePresignedUrl, useUploadToPresignedUrl } from "@/hooks/file";
import { useMe, useEditMe } from "@/hooks/member";
import { formatPhoneKorea } from "@/utils/formatPhoneKorea";
import { pickUploadedFilePublicUrlOrKey } from "@/utils/pickPresignedUrl";
import { pickPresignedPutUrl } from "@/utils/presigned";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

type LocationState = { toast?: string } | null;

export function EditInfoPage() {
  const { data: me, isLoading } = useMe({ refetchOnMount: "always" });
  const phone = formatPhoneKorea(me?.member.phone);

  const maxSizeMB = 5;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isUploadingProfile, setIsUploadingProfile] = useState(false);

  // 서버 프로필 URL
  const serverProfileUrl = useMemo(() => {
    const url = me?.roleData.user?.profileImage;
    return typeof url === "string" ? url : "";
  }, [me?.roleData.user?.profileImage]);

  // src="" 방지: 없으면 null
  const previewSrc =
    objectUrl ?? (serverProfileUrl.length > 0 ? serverProfileUrl : null);

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

  // presigned -> put upload -> editMe 3단계 프로세스 처리
  const { mutateAsync: issuePresignedUrl } = useIssuePresignedUrl();
  const { mutateAsync: uploadToPresignedUrl } = useUploadToPresignedUrl();
  const { mutateAsync: editMe } = useEditMe();

  const uploadProfileImage = async (picked: File) => {
    if (!me) throw new Error("내 정보가 아직 없어요.");

    const memberRecord = me.member as unknown as Record<string, unknown>;
    const memberId =
      (typeof memberRecord.memberId === "number"
        ? memberRecord.memberId
        : undefined) ??
      (typeof memberRecord.id === "number" ? memberRecord.id : undefined);

    if (typeof memberId !== "number") {
      throw new Error(
        "memberId를 찾을 수 없어요. me DTO(member.id/memberId) 확인해줘.",
      );
    }

    setIsUploadingProfile(true);

    try {
      //1. presigned 발급
      const presigned = await issuePresignedUrl({
        category: "PROFILE",
        fileName: picked.name,
        memberId,
      });

      console.log("[presigned.data]", presigned.data);

      //2. PUT URL만 먼저 뽑기 (여기까지 성공하면 PUT을 시도 가능)
      const putUrl = pickPresignedPutUrl(presigned.data);
      console.log("[PUT will start]", putUrl);

      //3. GCS PUT 업로드
      await uploadToPresignedUrl({
        url: putUrl,
        file: picked,
        contentType: picked.type || "application/octet-stream",
      });

      console.log("[PUT done]");

      //4. 저장용 url/key 확보
      const publicUrlOrKey = pickUploadedFilePublicUrlOrKey(
        presigned.data,
        putUrl,
      );
      console.log("[publicUrlOrKey]", publicUrlOrKey);

      //5. 우리 서버에 프로필 저장
      await editMe({ profileImageUrl: publicUrlOrKey });
      console.log("[editMe done]");

      //6. objectUrl 정리
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setObjectUrl(null);
      setError(null);
    } catch (err) {
      console.error("[uploadProfileImage error]", err);
      throw err;
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

    // 미리보기 세팅
    const url = URL.createObjectURL(picked);
    objectUrlRef.current = url;
    setObjectUrl(url);

    // 업로드 + editMe
    try {
      await uploadProfileImage(picked);
    } catch (err) {
      const m =
        err instanceof Error ? err.message : "프로필 사진 업로드에 실패했어요.";
      setError(m);
    }
  };

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
          {previewSrc ? (
            <img
              src={previewSrc}
              alt="프로필 이미지"
              draggable={false}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-neutral-800" />
          )}
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
          info={me?.roleData.user?.nickname}
          infoColor="gray"
        />

        <div className="flex justify-between p-4">
          <p>이름</p>
          <p className="mr-8 text-neutral-500">{me?.member.name}</p>
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
