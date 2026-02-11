import type { ReactNode } from "react";

type ContentProps = {
  content: string;
  subcontent?: string;
  icon?: ReactNode;
};

export default function ProcessStepSubContent({
  content,
  subcontent,
  icon,
}: ContentProps) {
  return (
    <div className="flex flex-col gap-[2px]">
      <p className="flex items-center gap-[6px] text-[0.8125rem] text-[#EC602D]">
        {icon}
        {content}
      </p>
      <p className="flex items-center gap-1 text-[0.8125rem] text-neutral-600">
        {subcontent}
      </p>
      <hr className="border-orange-500/30" />
    </div>
  );
}
