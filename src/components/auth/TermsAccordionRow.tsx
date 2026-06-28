import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/assets/icon";
import type { AgreementGroup } from "@/types/auth";
import { TermsContent } from "./TermsContent";
import { Collapse } from "@/components/common";

type Props = {
  leading: ReactNode;
  groups: AgreementGroup[];
  expanded: boolean;
  onToggleExpand: () => void;
  id?: string;
};

// 약관 아코디언 row (헤더 + 셰브론 토글 + 펼침 시 본문)
// 동의 화면(TermsAgreementItem)과 보기 화면(TermsPage)이 공유한다.
export function TermsAccordionRow({
  leading,
  groups,
  expanded,
  onToggleExpand,
  id,
}: Props) {
  return (
    <div id={id} className="border-neutral-850 flex flex-col border-b py-2">
      <div className="flex items-center justify-between">
        {leading}
        <button
          type="button"
          aria-label={expanded ? "약관 접기" : "약관 펼치기"}
          aria-expanded={expanded}
          onClick={onToggleExpand}
          className="flex h-6 w-6 items-center justify-center"
        >
          <ChevronLeftIcon
            className={`ease-smooth-out h-6 w-6 text-neutral-400 transition-transform duration-[var(--duration-fast)] motion-reduce:transition-none ${
              expanded ? "rotate-90" : "-rotate-90"
            }`}
          />
        </button>
      </div>
      <Collapse open={expanded}>
        <div className="pt-2">
          <TermsContent groups={groups} />
        </div>
      </Collapse>
    </div>
  );
}
