import { LogoIcon } from "@/assets/icon";
import type { ReactNode } from "react";

type EmptyViewProps = {
  icon?: ReactNode;
  content?: string;
};

export default function EmptyView({ icon, content }: EmptyViewProps) {
  return (
    <div className="pointer-events-none absolute inset-0 flex h-full flex-col items-center justify-center gap-4">
      {icon ?? <LogoIcon className="h-23.5 w-23.5" />}

      <div className="flex flex-col items-center justify-center text-center">
        {content ? (
          <p className="text-[16px] whitespace-pre-line text-neutral-200">
            {content}
          </p>
        ) : (
          <>
            <p className="text-[16px] text-neutral-200">
              검색 결과가 없습니다.
            </p>
            <p className="text-[16px] text-neutral-200">
              다른 키워드로 검색해보세요.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
