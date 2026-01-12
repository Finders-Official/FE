import type { ReactNode } from "react";

type BannerProps = {
  icon: ReactNode;
  title: string;
  content: string;
};

export default function Banner({ icon, title, content }: BannerProps) {
  return (
    <div className="flex flex-col bg-gradient-to-b from-[#EC602D]/21 to-[#5D1F09]/5 px-4 pt-4 pb-[2.375rem]">
      {/* 상단 영역 */}
      <div className="flex justify-end">
        <div className="flex h-[8.4375rem] w-[8.4375rem] items-start justify-end">
          {icon}
        </div>
      </div>

      {/* 하단 텍스트 영역 */}
      <div className="flex flex-col items-start">
        <h2 className="text-[20px] font-semibold text-neutral-100">{title}</h2>
        <p className="mt-2 text-[15px] text-neutral-100">{content}</p>
      </div>
    </div>
  );
}
