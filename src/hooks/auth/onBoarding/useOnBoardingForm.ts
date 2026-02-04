import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDebouncedValue } from "@/hooks/common";
import {
  useConfirmPhoneVerification,
  useNicknameCheck,
  useRequestPhoneVerification,
} from "@/hooks/member";
import { tokenStorage } from "@/utils/tokenStorage";
import { useSocialSignup } from "./useSignUp";
import { useAuthStore } from "@/store/useAuth.store";

type PhonePurpose = "SIGNUP" | "MY_PAGE";

type Options = {
  phonePurpose?: PhonePurpose;
};

function isValidNickname(n: string) {
  return /^[a-zA-Z0-9가-힣]{2,8}$/.test(n);
}

export function useOnBoardingForm(options?: Options) {
  const navigate = useNavigate();

  const phonePurpose: PhonePurpose = options?.phonePurpose ?? "SIGNUP";

  const [isSending, setIsSending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [verifiedNumber, setVerifiedNumber] = useState("");
  const [remainSec, setRemainSec] = useState(0);

  const [requestId, setRequestId] = useState<string | null>(null);
  const [verifiedPhoneToken, setVerifiedPhoneToken] = useState<string | null>(
    null,
  );

  const debouncedNickname = useDebouncedValue(nickname, 400);
  const nicknameTrimmed = useMemo(
    () => debouncedNickname.trim(),
    [debouncedNickname],
  );
  const nicknameValid = useMemo(
    () => isValidNickname(nicknameTrimmed),
    [nicknameTrimmed],
  );

  const {
    data: nicknameRes,
    isFetching: isCheckingNickname,
    error: nicknameError,
  } = useNicknameCheck(nicknameTrimmed, { enabled: nicknameValid, retry: 0 });

  const nicknameAvailable = nicknameRes?.data.available ?? false;

  const setUser = useAuthStore((s) => s.setUser);

  const { mutate: requestCode, isPending: isRequestingCode } =
    useRequestPhoneVerification({
      onSuccess: (res) => {
        setIsSending(true);
        setRemainSec(res.data.expiresIn);
        setRequestId(res.data.requestId);

        setIsVerified(false);
        setVerifiedPhoneToken(null);
      },
      onError: (e) => console.error(e.message),
    });

  const { mutate: confirmCode, isPending: isConfirmingCode } =
    useConfirmPhoneVerification({
      onSuccess: (res) => {
        if (res.data.phoneVerified) {
          setIsVerified(true);
          setVerifiedPhoneToken(res.data.verifiedPhoneToken);
        } else {
          setIsVerified(false);
          setVerifiedPhoneToken(null);
        }
      },
      onError: (e) => {
        console.error(e.message);
        setIsVerified(false);
        setVerifiedPhoneToken(null);
      },
    });

  useEffect(() => {
    if (!isSending) return;
    if (remainSec <= 0) return;

    const id = window.setTimeout(() => setRemainSec((prev) => prev - 1), 1000);
    return () => window.clearTimeout(id);
  }, [isSending, remainSec]);

  const nicknameStatusText =
    nickname.length === 0
      ? ""
      : !nicknameValid
        ? "2~8자, 한글/영문/숫자만 가능해요."
        : isCheckingNickname
          ? "닉네임 확인 중..."
          : nicknameError
            ? "닉네임 확인에 실패했어요."
            : nicknameAvailable
              ? "사용 가능한 닉네임이에요."
              : "이미 사용 중인 닉네임이에요.";

  const canSubmit =
    isVerified && !!verifiedPhoneToken && nicknameValid && nicknameAvailable;

  const { mutate: completeSignup, isPending: isCompleting } = useSocialSignup({
    onSuccess: (res) => {
      tokenStorage.setTokens({
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
        signupToken: null,
      });
      setUser({
        memberId: res.data.member.memberId,
        nickname: res.data.member.nickname,
      });
      navigate(`/auth/login?welcome=1&nonce=${crypto.randomUUID()}`, {
        replace: true,
      });
    },
    onError: (e) => console.error(e.message),
  });

  // ✅ 여기만 목적에 따라 달라짐
  const handleSend = () => requestCode({ phone, purpose: phonePurpose });

  const handleVerify = () => {
    if (remainSec <= 0) return;
    if (!requestId) return;
    if (verifiedNumber.length !== 6) return;
    confirmCode({ requestId, code: verifiedNumber });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);

    setIsSending(false);
    setRemainSec(0);
    setVerifiedNumber("");
    setIsVerified(false);
    setRequestId(null);
    setVerifiedPhoneToken(null);
  };

  const handleVerifiedNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerifiedNumber(digits);
  };

  const initPhone = (rawPhone: string) => {
    const digits = rawPhone.replace(/\D/g, "").slice(0, 11);
    setPhone(digits);

    setIsSending(false);
    setRemainSec(0);
    setVerifiedNumber("");
    setIsVerified(false);
    setRequestId(null);
    setVerifiedPhoneToken(null);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (!verifiedPhoneToken) return;

    completeSignup({
      nickname: nicknameTrimmed,
      phone,
      verifiedPhoneToken,
    });
  };

  return {
    // state
    isSending,
    isVerified,
    nickname,
    phone,
    verifiedNumber,
    remainSec,
    nicknameStatusText,
    canSubmit,

    // pending flags
    isRequestingCode,
    isConfirmingCode,
    isCompleting,

    // setters/handlers
    setNickname,
    handleSend,
    handleVerify,
    handlePhoneChange,
    handleVerifiedNumberChange,
    handleSubmit,

    // nickname edit
    nicknameTrimmed,
    nicknameValid,
    nicknameAvailable,
    isCheckingNickname,

    // phone edit
    verifiedPhoneToken,
    initPhone,

    //  지금 목적이 뭔지 화면에서 쓸 수 있게
    phonePurpose,
  };
}
