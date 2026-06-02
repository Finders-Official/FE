import { Checkbox } from "@/components/common";
import type { AgreementTerm } from "@/types/auth";
import { TermsAccordionRow } from "./TermsAccordionRow";

type Props = {
  term: AgreementTerm;
  checked: boolean;
  expanded: boolean;
  onToggleCheck: () => void;
  onToggleExpand: () => void;
};

export function TermsAgreementItem({
  term,
  checked,
  expanded,
  onToggleCheck,
  onToggleExpand,
}: Props) {
  return (
    <TermsAccordionRow
      groups={term.groups}
      expanded={expanded}
      onToggleExpand={onToggleExpand}
      leading={
        <div className="flex items-center gap-1.5">
          <Checkbox
            checked={checked}
            onChange={onToggleCheck}
            ariaLabel={term.label}
          />
          <button
            type="button"
            onClick={onToggleCheck}
            className="text-left text-[1.0625rem] leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100"
          >
            {term.label}
          </button>
        </div>
      }
    />
  );
}
