import type { ReactNode } from "react";
import { FlimIcon, ScanIcon, PrinterIcon, PackageIcon } from "@/assets/icon";

type Step = "DEVELOP" | "SCAN" | "PRINT" | "DELIVERY";

type ProcessProps = {
  step: Step;
  isCurrent: boolean;
  title: string;
  showSub: boolean;
  subComment?: ReactNode;
  content: string;
};

const ICON_BY_STEP: Record<
  Step,
  React.ComponentType<{ className?: string }>
> = {
  DEVELOP: FlimIcon,
  SCAN: ScanIcon,
  PRINT: PrinterIcon,
  DELIVERY: PackageIcon,
};

export default function Process({
  step,
  isCurrent,
  title,
  showSub,
  subComment,
  content,
}: ProcessProps) {
  const Icon = ICON_BY_STEP[step];

  const iconWrapperClass = [
    "flex h-[3.125rem] w-[3.125rem] items-center justify-center rounded-full border",
    isCurrent ? "bg-orange-500/6 border-orange-500" : "border-neutral-600",
  ].join(" ");

  const cardClass = [
    "flex w-[17.3125rem] flex-col justify-start rounded-xl border px-4 py-[0.625rem]",
    isCurrent ? "border-orange-500/30" : "border-neutral-600",
  ].join(" ");

  const titleClass = isCurrent
    ? "text-white text-4"
    : "text-neutral-600 text-4";
  const contentClass = isCurrent
    ? "text-white text-[0.8125rem]"
    : "text-neutral-600 text-[0.8125rem]";
  const iconClass = [
    "h-[1.5625rem] w-[1.5625rem]",
    isCurrent ? "text-orange-500" : "text-neutral-600",
  ].join(" ");

  return (
    <div className="flex items-start justify-between gap-5">
      <div className={iconWrapperClass}>
        <Icon className={iconClass} />
      </div>

      <div className={cardClass}>
        <h3 className={titleClass}>{title}</h3>

        {showSub && (
          <>
            <div>{subComment}</div>
            <br />
          </>
        )}

        <p className={contentClass}>{content}</p>
      </div>
    </div>
  );
}
