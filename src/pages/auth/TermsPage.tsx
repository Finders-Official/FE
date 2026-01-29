import { XMarkIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { sections } from "@/constants/terms";
import type { Section } from "@/types/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";

function getHashId(): Section["id"] | null {
  const raw = window.location.hash.replace("#", "").trim();
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

  useEffect(() => {
    const id = getHashId();
    if (id) {
      // 렌더 직후 스크롤이 안정적으로 되도록 한 틱 미룸
      window.setTimeout(() => scrollToSection(id), 0);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const id = getHashId();
      if (id) scrollToSection(id);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <div className="min-h-dvh text-neutral-100">
      <div>
        <Header
          title="약관 동의"
          rightAction={{
            type: "icon",
            icon: <XMarkIcon />,
            onClick: () => navigate(-1),
          }}
        />

        {/* 본문 */}
        <main className="mx-auto w-full px-2">
          {sections.map((s) => {
            return (
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
            );
          })}
        </main>
      </div>
    </div>
  );
}
