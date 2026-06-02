import { useNavigate } from "react-router";
import { CTA_Button, Checkbox, Header } from "@/components/common";
import { TermsAgreementItem } from "@/components/auth";
import { AGREEMENT_TERMS } from "@/constants/auth/agreementTerms";
import { useTermsAgreement } from "@/hooks/auth/onBoarding";

export function TermsAgreementPage() {
  const navigate = useNavigate();
  const {
    checked,
    expanded,
    allChecked,
    requiredAllChecked,
    toggle,
    toggleAll,
    toggleExpand,
    agreedTermTypes,
  } = useTermsAgreement();

  const handleConfirm = () => {
    if (!requiredAllChecked) return;
    navigate("/auth/onboarding", { state: { agreedTermTypes } });
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        title="약관 동의"
        showBack
        onBack={() => navigate("/auth/login", { replace: true })}
      />

      {/* 전체 동의 */}
      <div className="border-neutral-875 flex items-center gap-2 border-b-4 py-3">
        <Checkbox
          checked={allChecked}
          onChange={toggleAll}
          ariaLabel="전체 동의"
        />
        <button
          type="button"
          onClick={toggleAll}
          className="text-neutral-0 text-base font-semibold tracking-[-0.02em]"
        >
          전체 동의
        </button>
      </div>

      {/* 약관 목록 */}
      <div className="flex flex-col py-3">
        {AGREEMENT_TERMS.map((term) => (
          <TermsAgreementItem
            key={term.id}
            term={term}
            checked={checked[term.id]}
            expanded={Boolean(expanded[term.id])}
            onToggleCheck={() => toggle(term.id)}
            onToggleExpand={() => toggleExpand(term.id)}
          />
        ))}
      </div>

      <footer className="border-neutral-850 mt-auto w-full border-t bg-neutral-900 py-5">
        <CTA_Button
          text="확인"
          color="orange"
          size="xlarge"
          disabled={!requiredAllChecked}
          onClick={handleConfirm}
        />
      </footer>
    </div>
  );
}
