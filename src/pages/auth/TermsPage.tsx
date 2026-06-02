import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/common";
import { TermsAccordionRow } from "@/components/auth";
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
          <TermsAccordionRow
            key={term.id}
            id={term.id}
            groups={term.groups}
            expanded={Boolean(expanded[term.id])}
            onToggleExpand={() => toggle(term.id)}
            leading={
              <p className="text-[1.0625rem] leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100">
                {term.label}
              </p>
            }
          />
        ))}
      </div>
    </div>
  );
}

// 카카오 회원가입에서 여기로 왔을 때는 체크박스 표시 -> 회원가입 완료 api 에서 agreeementID로 넘겨야 함
// 이용약관 페이지에서 오면 체크박스 제거
