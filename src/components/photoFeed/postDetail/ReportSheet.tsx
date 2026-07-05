import { useEffect, useState } from "react";
import SheetPopup from "./SheetPopup";
import type { ReportReason } from "@/apis/photoFeed/report.api";

/** 신고 사유 옵션 (피그마 기획 순서) */
const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: "SPAM", label: "스팸/홍보" },
  { value: "PORN", label: "음란물" },
  { value: "ABUSE", label: "욕설/혐오 표현" },
  { value: "PRIVACY", label: "개인정보 노출" },
  { value: "ILLEGAL", label: "불법 정보" },
];

interface ReportSheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason) => void;
  isSubmitting?: boolean;
}

export default function ReportSheet({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ReportSheetProps) {
  const [selected, setSelected] = useState<ReportReason | null>(null);

  // 열릴 때마다 선택 초기화
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  return (
    <SheetPopup
      open={open}
      onClose={onClose}
      footer={
        <button
          type="button"
          disabled={!selected || isSubmitting}
          onClick={() => {
            if (selected) onSubmit(selected);
          }}
          className={`bg-neutral-875 my-4 w-full rounded-3xl border border-neutral-800 py-4 text-center text-[0.9375rem] ${
            selected ? "text-red-400" : "text-neutral-500"
          }`}
        >
          신고하기
        </button>
      }
    >
      {REPORT_REASONS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => setSelected(r.value)}
          className={`w-full py-4 text-center text-[0.9375rem] ${
            selected === r.value ? "text-red-400" : "text-neutral-100"
          }`}
        >
          {r.label}
        </button>
      ))}
    </SheetPopup>
  );
}
