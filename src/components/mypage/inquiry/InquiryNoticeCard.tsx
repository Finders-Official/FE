export function InquiryNoticeCard() {
  return (
    <div>
      <ul className="flex flex-col gap-1">
        <li className="flex gap-2 text-[0.75rem] leading-[155%] font-normal tracking-[-0.01625rem] text-neutral-400">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-400" />
          <span className="flex-1">
            문의 답변은 영업일 기준 익일 내로 완료됩니다.(주말 및 공휴일 제외)
          </span>
        </li>
        <li className="flex gap-2 text-[0.75rem] leading-[155%] font-normal tracking-[-0.01625rem] text-neutral-400">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-400" />
          <span className="flex-1">
            1:1 문의 접수 내역은 관련 규정에 따라 회원탈퇴일로부터 3년간
            안전하게 보관됩니다.
          </span>
        </li>
        <li className="flex gap-2 text-[0.75rem] leading-[155%] font-normal tracking-[-0.01625rem] text-neutral-400">
          <span className="mt-1.5 h-1 w-1 rounded-full bg-neutral-400" />
          <span className="flex-1">
            욕설, 비방, 악의적인 목적의 문의는 답변이 제한되거나 서비스 이용에
            불이익이 발생할 수 있습니다.
          </span>
        </li>
      </ul>
    </div>
  );
}
