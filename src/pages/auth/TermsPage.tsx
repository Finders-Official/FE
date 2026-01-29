import { XMarkIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { CTA_Button } from "@/components/common/CTA_Button";
import { sections } from "@/constants/terms";
import type { Section } from "@/types/auth";
import { useEffect, useMemo } from "react";
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

export function TermsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // sections 순서 고정
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const idToIndex = useMemo(() => {
    const m = new Map<Section["id"], number>();
    ids.forEach((id, idx) => m.set(id, idx));
    return m;
  }, [ids]);

  const currentId = useMemo(
    () => getHashIdFrom(location.hash),
    [location.hash],
  );

  const currentIndex = useMemo(() => {
    if (!currentId) return 0;
    const idx = idToIndex.get(currentId);
    return typeof idx === "number" ? idx : 0;
  }, [currentId, idToIndex]);

  const isLast = currentIndex >= ids.length - 1;

  // 해시가 바뀔 때마다 해당 섹션으로 스크롤
  useEffect(() => {
    if (!currentId) return;
    window.setTimeout(() => scrollToSection(currentId), 0);
  }, [currentId]);

  const handleNextOrConfirm = () => {
    if (isLast) {
      window.history.back(); // 카카오 약관 화면으로 이동
      return;
    }

    const nextId = ids[currentIndex + 1];
    if (!nextId) return;

    navigate(
      { pathname: location.pathname, hash: `#${nextId}` },
      { replace: true }, //해시 쌓임 방지
    );
  };

  return (
    <div className="min-h-dvh text-neutral-100">
      <div className="pb-[calc(env(safe-area-inset-bottom)+6.75rem)]">
        <Header
          title="약관 동의"
          rightAction={{
            type: "icon",
            icon: <XMarkIcon />,
            onClick: () => window.history.back,
          }}
        />

        <main className="mx-auto w-full px-2">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <div className="border-neutral-850 mt-6 border-b pb-6">
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

      <div className="border-neutral-850 fixed inset-x-0 bottom-0 z-20 border-t bg-neutral-950/90 backdrop-blur">
        <div className="mx-auto w-full px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
          <CTA_Button
            text={isLast ? "확인" : "다음"}
            color="orange"
            size="xlarge"
            onClick={handleNextOrConfirm}
            disabled={!currentId}
          />
        </div>
      </div>
    </div>
  );
}
