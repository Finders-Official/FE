import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeftIcon } from "@/assets/icon";
import { Header } from "@/components/common";
import { TermsContent } from "@/components/auth";
import { AGREEMENT_TERMS } from "@/constants/auth/agreementTerms";

type ExpandMap = Record<string, boolean>;

// 약관 보기: 기본적으로 모두 펼친 상태
const createExpandedMap = (): ExpandMap =>
  Object.fromEntries(AGREEMENT_TERMS.map((t) => [t.id, true]));

export function TermsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<ExpandMap>(createExpandedMap);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex w-full flex-col">
      <Header title="약관 동의" showBack onBack={() => navigate(-1)} />

      <div className="flex flex-col py-3">
        {AGREEMENT_TERMS.map((term) => (
          <div
            key={term.id}
            id={term.id}
            className="border-neutral-850 flex flex-col gap-2 border-b py-2"
          >
            <div className="flex items-center justify-between">
              <p className="text-[1.0625rem] leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100">
                {term.label}
              </p>
              <button
                type="button"
                aria-label={expanded[term.id] ? "약관 접기" : "약관 펼치기"}
                aria-expanded={Boolean(expanded[term.id])}
                onClick={() => toggle(term.id)}
                className="flex h-6 w-6 items-center justify-center"
              >
                <ChevronLeftIcon
                  className={`h-6 w-6 text-neutral-400 transition-transform ${
                    expanded[term.id] ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
            {expanded[term.id] && <TermsContent groups={term.groups} />}
          </div>
        ))}
      </div>
    </div>
  );
}
