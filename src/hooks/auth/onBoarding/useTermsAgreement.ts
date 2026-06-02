import { useMemo, useState } from "react";
import {
  AGREEMENT_TERMS,
  ALWAYS_AGREED_TERMS,
} from "@/constants/auth/agreementTerms";
import type { TermsType } from "@/types/auth";

type BoolMap = Record<string, boolean>;

const createCheckedMap = (value: boolean): BoolMap =>
  Object.fromEntries(AGREEMENT_TERMS.map((t) => [t.id, value]));

export function useTermsAgreement() {
  const [checked, setChecked] = useState<BoolMap>(() =>
    createCheckedMap(false),
  );
  const [expanded, setExpanded] = useState<BoolMap>({});

  const allChecked = AGREEMENT_TERMS.every((t) => checked[t.id]);

  // 필수 약관(서비스/개인정보)이 모두 체크되어야 "확인" 활성화
  const requiredAllChecked = AGREEMENT_TERMS.filter((t) => t.required).every(
    (t) => checked[t.id],
  );

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleAll = () => setChecked(createCheckedMap(!allChecked));

  const toggleExpand = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  // 체크된 항목의 타입 + 항상 동의 타입(SERVICE_INFO)
  const agreedTermTypes = useMemo<TermsType[]>(() => {
    const fromChecked = AGREEMENT_TERMS.filter((t) => checked[t.id]).flatMap(
      (t) => t.agreeTypes,
    );
    return Array.from(new Set([...ALWAYS_AGREED_TERMS, ...fromChecked]));
  }, [checked]);

  return {
    checked,
    expanded,
    allChecked,
    requiredAllChecked,
    toggle,
    toggleAll,
    toggleExpand,
    agreedTermTypes,
  };
}
