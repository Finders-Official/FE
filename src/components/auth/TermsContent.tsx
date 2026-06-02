import type { AgreementGroup } from "@/types/auth";

type Props = {
  groups: AgreementGroup[];
  className?: string;
};

// 약관 본문(그룹) 렌더러 — 약관 동의 화면과 약관 보기 화면이 공유
export function TermsContent({ groups, className = "" }: Props) {
  return (
    <div
      className={`flex flex-col gap-2 text-[0.875rem] leading-[1.55] tracking-[-0.0175rem] text-neutral-200 ${className}`}
    >
      {groups.map((group, i) => (
        <div key={i} className="flex flex-col">
          {group.heading && (
            <p className="font-semibold whitespace-pre-wrap">{group.heading}</p>
          )}
          {group.text && (
            <p className="font-normal whitespace-pre-wrap">{group.text}</p>
          )}
          {group.items &&
            group.items.length > 0 &&
            (group.ordered ? (
              <ol className="ms-5 list-decimal">
                {group.items.map((item, j) => (
                  <li key={j} className="font-normal">
                    {item}
                  </li>
                ))}
              </ol>
            ) : (
              <ul className="ms-5 list-disc">
                {group.items.map((item, j) => (
                  <li key={j} className="font-normal">
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          {group.note && (
            <p className="mt-1 font-normal whitespace-pre-wrap">{group.note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
