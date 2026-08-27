import { useState } from "react";
import { Press } from "@/components/common";
import { useReviewLogin } from "@/hooks/auth/login/useReviewLogin";

interface ReviewLoginDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * 스토어 심사관 전용 로그인 시트.
 *
 * 로그인 화면에 상시 노출되는 버튼이 아니라 로고 롱프레스로만 열린다. 일반 사용자가 우연히
 * 마주치지 않으면서, 심사 노트에 진입 방법을 한 줄로 적을 수 있는 형태다.
 */
export const ReviewLoginDialog = ({
  open,
  onClose,
  onSuccess,
}: ReviewLoginDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { mutate, isPending } = useReviewLogin({
    onSuccess,
    onError: (message) => setErrorMessage(message),
  });

  if (!open) return null;

  const canSubmit = email.trim() !== "" && password !== "" && !isPending;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setErrorMessage("");
    mutate({ email: email.trim(), password });
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrorMessage("");
    onClose();
  };

  const fieldClass =
    "w-full rounded-xl border bg-neutral-875 px-4 py-3 text-neutral-0 placeholder:text-neutral-500 " +
    "border-neutral-800 focus:border-orange-500 focus:bg-neutral-850 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 배경 스크림 — 누르는 대상이 아니라 닫기용 히트 영역이라 Press 의 눌림 모션이 붙으면
          시트 전체가 흔들린다. 공용 컴포넌트를 의도적으로 쓰지 않는다. */}
      {/* eslint-disable-next-line no-restricted-syntax */}
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 bg-black/60"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-[30rem] rounded-t-2xl bg-neutral-900 px-5 pt-6 pb-10">
        <h2 className="text-lg font-semibold">App Review Sign In</h2>
        <p className="mt-1 text-sm text-neutral-400">
          스토어 심사용 계정으로 로그인합니다.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            placeholder="Email"
            className={fieldClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              // 심사관이 입력값을 확인할 수 있어야 해서 토글을 두되, 기본은 가린다.
              type={showPassword ? "text" : "password"}
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Password"
              className={`${fieldClass} pr-16`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <Press
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-medium text-neutral-400"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "숨김" : "보기"}
            </Press>
          </div>

          {errorMessage !== "" && (
            <p className="text-sm text-orange-500">{errorMessage}</p>
          )}

          <Press
            type="button"
            disabled={!canSubmit}
            className="text-neutral-0 mt-2 h-[3.125rem] w-full rounded-2xl bg-orange-500 font-semibold disabled:bg-neutral-800 disabled:text-neutral-500"
            onClick={handleSubmit}
          >
            {isPending ? "Signing in..." : "Sign in"}
          </Press>
        </div>
      </div>
    </div>
  );
};
