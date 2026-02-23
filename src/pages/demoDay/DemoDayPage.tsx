import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Header from "@/components/common/Header";
import { RestoraionSparkleIcon } from "@/assets/icon";
import { useAuthStore } from "@/store/useAuth.store";
import { useLoginModalStore } from "@/store/useLoginModal.store";

import { setRedirectAfterLogin } from "./redirectAfterLogin";

// ─── 데모 이미지 설정 (파일 추가 후 여기만 수정) ───
const DEMO_IMAGES = [
  { src: "/demo-day/restore1.jpg", label: "사진 1" },
  { src: "/demo-day/restore2.jpg", label: "사진 2" },
  { src: "/demo-day/restore3.jpg", label: "사진 3" },
  { src: "/demo-day/restore4.jpg", label: "사진 4" },
] as const;

const FRAME_CODES = ["15", "16", "17", "18"];

const PENDING_KEY = "finders:demoday-pending-image";

export default function DemoDayPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const openLoginModal = useLoginModalStore((s) => s.openLoginModal);

  // ─── 로그인 후 자동 복원 진행 ───
  useEffect(() => {
    const pendingRaw = sessionStorage.getItem(PENDING_KEY);
    if (!pendingRaw) return;
    if (!user) return;

    sessionStorage.removeItem(PENDING_KEY);
    const index = Number(pendingRaw);
    const image = DEMO_IMAGES[index];
    if (!image) return;

    navigate("/restore/editor", {
      state: { imageUrl: image.src },
    });
  }, [user, navigate]);

  const handleRestore = useCallback(
    (index: number) => {
      const image = DEMO_IMAGES[index];
      if (!image) return;

      const isAuthed = Boolean(user && user.memberId > 0);

      if (isAuthed) {
        navigate("/restore/editor", {
          state: { imageUrl: image.src },
        });
      } else {
        sessionStorage.setItem(PENDING_KEY, String(index));
        setRedirectAfterLogin("/demo-day");
        openLoginModal();
      }
    },
    [user, navigate, openLoginModal],
  );

  return (
    <div className="relative flex w-full flex-col bg-neutral-900">
      {/* 히어로 그라데이션 */}
      <div className="pointer-events-none absolute -inset-x-4 top-0 z-0 h-80 bg-[radial-gradient(ellipse_at_15%_55%,rgba(233,78,22,0.18)_0%,transparent_55%)] sm:-inset-x-6 lg:-inset-x-8" />

      <Header title="파인더스 데모데이" showBack={false} />

      <div className="scrollbar-hide relative z-10 flex-1 overflow-y-auto">
        {/* 히어로 영역 */}
        <section className="animate-demoday-fade-in relative px-2 pt-4 pb-5">
          <div className="relative">
            <h2 className="text-[1.5rem] leading-tight font-bold text-neutral-100">
              <span className="animate-demoday-slide-up inline-block">
                타버린 사진도
              </span>
              <br />
              <span className="animate-demoday-slide-up inline-block [animation-delay:0.1s]">
                AI로 다시
              </span>{" "}
              <span className="animate-demoday-slide-up inline-block text-orange-500 [animation-delay:0.15s]">
                살려보세요
              </span>
            </h2>
            <p className="animate-demoday-fade-in mt-2 text-[0.875rem] text-neutral-400 [animation-delay:0.3s]">
              사진을 꾹 눌러 저장하고, 복원해 보세요
            </p>
          </div>
        </section>

        {/* 필름 스트립 */}
        <div className="relative mx-1 mb-10">
          {/* 필름 베이스 — 양쪽 스프로킷 레일 포함 */}
          <div className="film-strip animate-demoday-fade-in rounded-sm">
            {DEMO_IMAGES.map((image, index) => (
              <FilmFrame
                key={image.src}
                image={image}
                index={index}
                frameCode={FRAME_CODES[index]}
                onRestore={() => handleRestore(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 양쪽 스프로킷 홀 ───
function SprocketRail({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-[0.625rem] w-[0.375rem] rounded-[1px] bg-neutral-900"
          style={{
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.6)",
          }}
        />
      ))}
    </>
  );
}

// ─── 필름 프레임 ───

interface FilmFrameProps {
  image: (typeof DEMO_IMAGES)[number];
  index: number;
  frameCode: string | undefined;
  onRestore: () => void;
}

function FilmFrame({ image, index, frameCode, onRestore }: FilmFrameProps) {
  const [imgError, setImgError] = useState(false);
  const developDelay = 0.4 + index * 0.8;
  const ctaDelay = developDelay + 1.6;

  return (
    <div>
      {/* 프레임 한 줄: 좌 스프로킷 | 이미지 | 우 스프로킷 */}
      <div className="flex">
        {/* 좌측 스프로킷 레일 */}
        <div className="flex w-5 shrink-0 flex-col items-center justify-evenly">
          <SprocketRail count={6} />
        </div>

        {/* 이미지 + 프레임 정보 */}
        <div className="min-w-0 flex-1 py-1.5">
          {/* 사진 */}
          <div className="relative overflow-hidden bg-[#15120a]">
            {imgError ? (
              <div className="bg-neutral-850 flex aspect-[3/2] items-center justify-center text-sm text-neutral-600">
                이미지 준비 중
              </div>
            ) : (
              <>
                <img
                  src={image.src}
                  alt={image.label}
                  onError={() => setImgError(true)}
                  className="aspect-[3/2] w-full object-cover"
                  style={{
                    WebkitTouchCallout: "default",
                    WebkitUserSelect: "auto",
                    userSelect: "auto",
                  }}
                />
                {/* 현상 오버레이 — 세피아 톤 */}
                <div
                  className="animate-demoday-tint pointer-events-none absolute inset-0"
                  style={{
                    animationDelay: `${developDelay}s`,
                    backgroundColor: "#3a1800",
                  }}
                />
                {/* 현상 오버레이 — 암흑 */}
                <div
                  className="animate-demoday-reveal pointer-events-none absolute inset-0 bg-black"
                  style={{ animationDelay: `${developDelay}s` }}
                />
              </>
            )}
            {/* 힌트 */}
            <div
              className="animate-demoday-fade-in pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end bg-gradient-to-t from-black/40 to-transparent p-2 opacity-0"
              style={{ animationDelay: `${developDelay + 1.5}s` }}
            >
              <span className="text-[0.625rem] text-white/50">
                꾹 눌러서 저장
              </span>
            </div>
          </div>

          {/* 프레임 정보 (필름 리베이트 영역) */}
          <div className="flex items-center justify-between px-0.5 pt-1.5 pb-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[0.625rem] font-bold text-orange-400/60">
                {frameCode}
              </span>
              <span className="text-[0.5rem] text-orange-400/30">{"▶ "}</span>
              <span className="font-mono text-[0.5rem] tracking-[0.15em] text-orange-400/30">
                FINDERS 400
              </span>
            </div>
            <span className="font-mono text-[0.5rem] tracking-wider text-orange-400/30">
              {frameCode}A
            </span>
          </div>

          {/* 복원하러 가기 CTA */}
          <button
            type="button"
            onClick={onRestore}
            className="animate-demoday-fade-in mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2.5 text-[0.8125rem] font-semibold text-white opacity-0 transition-all active:scale-[0.98] active:brightness-90"
            style={{ animationDelay: `${ctaDelay}s` }}
          >
            <RestoraionSparkleIcon className="h-4 w-4" strokeWidth={0} />
            복원하러 가기
          </button>
        </div>

        {/* 우측 스프로킷 레일 */}
        <div className="flex w-5 shrink-0 flex-col items-center justify-evenly">
          <SprocketRail count={6} />
        </div>
      </div>
    </div>
  );
}
