import { XMarkIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { CTA_Button } from "@/components/common/CTA_Button";
import { sections } from "@/constants/terms";
import type { Section } from "@/types/auth";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

function getHashIdFrom(hash: string): Section["id"] | null {
  const raw = hash.replace("#", "").trim();
  if (
    raw === "service" ||
    raw === "privacy" ||
    raw === "notify" ||
    raw === "location"
  ) {
    return raw;
  }
  return null;
}

function scrollToSection(id: Section["id"]) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const ids = sections.map((s) => s.id);
const idToIndex = new Map<Section["id"], number>(
  ids.map((id, idx) => [id, idx]),
);

export function TermsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentId = getHashIdFrom(location.hash);
  const showCta = Boolean(currentId);

  const currentIndex = currentId ? (idToIndex.get(currentId) ?? 0) : 0;
  const isLast = currentIndex >= ids.length - 1;

  const lastScrolledHashRef = useRef<string | null>(null);
  const hashRef = useRef(location.hash);
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    hashRef.current = location.hash;
    pathnameRef.current = location.pathname;
  }, [location.hash, location.pathname]);

  const navigateRef = useRef(navigate);
  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    if (!currentId) return;
    const nextHash = `#${currentId}`;
    if (lastScrolledHashRef.current === nextHash) {
      lastScrolledHashRef.current = null;
      return;
    }
    const id = window.setTimeout(() => scrollToSection(currentId), 0);
    return () => window.clearTimeout(id);
  }, [currentId]);

  useEffect(() => {
    const map = new Map<Section["id"], number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute("id") as Section["id"] | null;
          if (!id) continue;
          map.set(id, e.isIntersecting ? e.intersectionRatio : 0);
        }

        let bestId: Section["id"] | null = null;
        let bestRatio = 0;

        for (const [id, ratio] of map.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (!bestId) return;

        const nextHash = `#${bestId}`;
        if (hashRef.current === nextHash) return;

        lastScrolledHashRef.current = nextHash;

        navigateRef.current(
          { pathname: pathnameRef.current, hash: nextHash },
          { replace: true }, // 모바일 웹뷰 버그 방지를 위해 히스토리를 강제 고정함
        );
      },
      {
        root: null,
        // 고정 픽셀 배제하고 모바일 세로 화면 비율에 안전하도록 조정
        rootMargin: "-20% 0px -30% 0px",
        threshold: Array.from({ length: 11 }, (_, i) => i / 10), // 연산 최적화를 위해 11단계로 경량화
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  }, []);

  // 안전한 이탈/확인 핸들러 함수
  const handleExitTerms = () => {
    // 앱 내 인앱 브라우저나 새 창으로 열렸을 경우,
    // 브라우저의 window.close()가 새 창을 닫고 카카오로 보내줌
    if (window.opener || window.history.length === 1) {
      window.close();
    } else {
      // 일반 웹 브라우저 뒤로가기 대응
      window.history.back();
    }
  };

  const handleNextOrConfirm = () => {
    if (isLast) {
      handleExitTerms();
      return;
    }

    const nextId = ids[currentIndex + 1];
    if (!nextId) return;

    navigate(
      { pathname: location.pathname, hash: `#${nextId}` },
      { replace: true },
    );
  };

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div
        className={
          showCta
            ? "pb-[calc(env(safe-area-inset-bottom)+6.75rem)]"
            : "pb-[calc(env(safe-area-inset-bottom)+3.75rem)]"
        }
      >
        <Header
          title="약관 동의"
          rightAction={{
            type: "icon",
            icon: <XMarkIcon />,
            onClick: handleExitTerms, // X 버튼도 안전한 종료 로직 연동
          }}
        />

        <main className="mx-auto w-full px-4">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <div className="border-neutral-850 mt-6 border-b pb-12">
                <div className="flex items-center gap-2">
                  <h2 className="text-[1.1875rem] font-semibold text-neutral-100">
                    {s.title}{" "}
                    <span className="text-sm font-normal text-neutral-400">
                      {s.badge === "필수" ? "(필수)" : "(선택)"}
                    </span>
                  </h2>
                </div>

                <p className="mt-4 text-[0.875rem] leading-[160%] tracking-[-0.0175rem] break-words whitespace-pre-wrap text-neutral-300">
                  {s.body}
                </p>
              </div>
            </section>
          ))}
        </main>
      </div>

      {showCta && (
        <div className="border-neutral-850 fixed inset-x-0 bottom-0 z-20 border-t bg-neutral-950/80 backdrop-blur-md">
          <div className="mx-auto w-full px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
            <CTA_Button
              text={isLast ? "확인" : "다음"}
              color="orange"
              size="xlarge"
              onClick={handleNextOrConfirm}
            />
          </div>
        </div>
      )}
    </div>
  );
}
