import type { ReactNode } from "react";
import { FlimIcon, ScanIcon, PrinterIcon, PackageIcon } from "@/assets/icon";

type Step = "DEVELOP" | "SCAN" | "PRINT_DELIVERY" | "PRINT_PICKUP" | "DELIVERY";

type ProcessProps = {
  step: Step;
  isCurrent: boolean;
  title: string;
  subComment?: ReactNode;
  content: ReactNode;
  buttons?: ReactNode;

  /** 타임라인용: 전체에서 몇 번째인지 / 마지막인지 */
  index: number;
  currentIndex: number; // 현재 단계의 index
  isLast?: boolean;
};

const ICON_BY_STEP: Record<
  Step,
  React.ComponentType<{ className?: string }>
> = {
  DEVELOP: FlimIcon,
  SCAN: ScanIcon,
  PRINT_DELIVERY: PrinterIcon,
  PRINT_PICKUP: PrinterIcon,
  DELIVERY: PackageIcon,
};

type LineVariant = "DONE" | "CURRENT" | "TODO";

function getLineVariant(index: number, currentIndex: number): LineVariant {
  if (index < currentIndex) return "DONE"; // 완료 단계의 아래 선
  if (index === currentIndex) return "CURRENT"; // 현재→다음 선(그라데이션)
  return "TODO"; // 이후 단계의 아래 선
}

export default function Process({
  step,
  isCurrent,
  title,
  subComment,
  content,
  buttons,
  index,
  currentIndex,
  isLast = false,
}: ProcessProps) {
  const Icon = ICON_BY_STEP[step];

  const iconWrapperClass = [
    "flex h-[3.125rem] w-[3.125rem] items-center justify-center rounded-full border",
    isCurrent ? "bg-orange-500/6 border-orange-500" : "border-neutral-600",
  ].join(" ");

  const cardClass = [
    "flex flex-col justify-start rounded-xl border px-4 py-[0.625rem]",
    isCurrent
      ? "border-orange-500/30 w-[17.3125rem]"
      : "border-neutral-600 w-[15.375rem]",
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

  // 선 스타일 결정
  const lineVariant = getLineVariant(index, currentIndex);

  const lineClass = [
    "w-[0.125rem] min-h-8 rounded-full",
    lineVariant === "DONE" && "bg-orange-500",
    lineVariant === "TODO" && "bg-neutral-700",
    lineVariant === "CURRENT" &&
      "bg-gradient-to-b from-orange-500 to-neutral-700",
    lineVariant === "CURRENT" && step === "PRINT_DELIVERY" && "h-58",
    // 인화 단계이고 직접 수령인 경우
    lineVariant === "CURRENT" && step === "PRINT_PICKUP" && "h-38",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex items-start gap-5">
      {/* 아이콘 + 아래 선 (개별) */}
      <div className="flex w-[3.125rem] flex-col items-center">
        <div className={iconWrapperClass}>
          <Icon className={iconClass} />
        </div>

        {/* 마지막 단계는 선 없음 */}
        {!isLast && <div className={lineClass} />}
      </div>

      {/* 카드 */}
      <div className="flex flex-col gap-[0.625rem]">
        <div className={cardClass}>
          <h3 className={titleClass}>{title}</h3>

          {isCurrent && <div>{subComment}</div>}

          <p className={contentClass}>{content}</p>
        </div>

        {/** Action 버튼들 */}
        {isCurrent && <div>{buttons}</div>}
      </div>
    </div>
  );
}
