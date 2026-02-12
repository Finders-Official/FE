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

// sections는 상수이므로 파생값도 모듈 레벨에서 한 번만 계산
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

  //해시 클릭/다음 버튼 등으로 hash가 바뀔 때만 스크롤
  //스크롤로 인해 hash가 바뀌는 경우(아래 observer)는 다시 스크롤시키지 않게 가드
  const lastScrolledHashRef = useRef<string | null>(null);

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

  //스크롤 내리면 가장 많이 보이는 섹션으로 해시 자동 변경
  useEffect(() => {
    const map = new Map<Section["id"], number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.getAttribute("id") as Section["id"] | null;
          if (!id) continue;
          map.set(id, e.isIntersecting ? e.intersectionRatio : 0);
        }

        // 현재 가장 많이 보이는 섹션 선택
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
        if (location.hash === nextHash) return;

        // observer로 바꾼 hash는 스크롤 트리거 안 걸리게 표시
        lastScrolledHashRef.current = nextHash;

        navigate(
          { pathname: location.pathname, hash: nextHash },
          { replace: true },
        );
      },
      {
        root: null,
        // 헤더 고정 고려해서 상단은 좀 깎고, CTA 영역도 하단을 조금 깎음
        rootMargin: "-96px 0px -120px 0px",
        // ratio 추적을 촘촘하게 -> 판단 정확도 높임
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
      },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  }, [navigate, location.pathname, location.hash]);

  const handleNextOrConfirm = () => {
    if (isLast) {
      window.history.back();
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
    <div className="min-h-dvh text-neutral-100">
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
            onClick: () => window.history.back(),
          }}
        />

        <main className="mx-auto w-full px-2">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <div className="border-neutral-850 mt-6 border-b pb-50">
                <div className="flex items-center gap-2">
                  <h2 className="text-[1.1875rem] font-semibold text-neutral-100">
                    {s.title}{" "}
                    <span className="text-neutral-100">
                      {s.badge === "필수" ? "(필수)" : "(선택)"}
                    </span>
                  </h2>
                </div>

                <p className="mt-5 text-[0.875rem] leading-[155%] tracking-[-0.0175rem] break-words whitespace-pre-wrap text-neutral-200">
                  {s.body}
                </p>
              </div>
            </section>
          ))}
        </main>
      </div>

      {showCta && (
        <div className="border-neutral-850 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur">
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
