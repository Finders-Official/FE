import { ChevronLeftIcon } from "@/assets/icon";
import { Checkbox } from "@/components/common";
import type { AgreementTerm } from "@/types/auth";
import { TermsContent } from "./TermsContent";

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
    <div className="border-neutral-850 flex flex-col gap-2 border-b py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Checkbox checked={checked} onChange={onToggleCheck} />
          <button
            type="button"
            onClick={onToggleCheck}
            className="text-left text-[1.0625rem] leading-[1.26] font-semibold tracking-[-0.02em] text-neutral-100"
          >
            {term.label}
          </button>
        </div>
        <button
          type="button"
          aria-label={expanded ? "약관 접기" : "약관 펼치기"}
          aria-expanded={expanded}
          onClick={onToggleExpand}
          className="flex h-6 w-6 items-center justify-center"
        >
          <ChevronLeftIcon
            className={`h-6 w-6 text-neutral-400 transition-transform ${
              expanded ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>
      </div>

      {expanded && <TermsContent groups={term.groups} />}
    </div>
  );
}
