export const WITHDRAW_NOTICES = [
  "작성한 리뷰는 삭제되지 않으며 닉네임은 '알 수 없음'으로 표시됩니다.",
  "계정이 삭제된 이후에는 복구할 수 없습니다.",
  "탈퇴 즉시 7일 이내에는 동일 계정으로 다시 가입할 수 없습니다.",
  "보유하신 크레딧은 소멸됩니다.",
] as const;

export function NoticeCard() {
  return (
    <div className="bg-neutral-875 mt-6 rounded-[1rem] px-4 py-6">
      <ul className="flex flex-col gap-1">
        {WITHDRAW_NOTICES.map((t) => (
          <li
            key={t}
            className="flex gap-2 text-[0.825rem] leading-[155%] font-normal tracking-[-0.01625rem] text-neutral-200"
          >
            <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-200" />
            <span className="flex-1">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
