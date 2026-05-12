export function InquiryNoticeCard() {
  return (
    <div>
      <ul className="flex flex-col gap-1">
        <li className="text-indent-[-1rem] list-inside list-disc text-[0.75rem] text-neutral-500">
          문의 답변은 영업일 기준 익일 내로 완료됩니다. (주말 및 공휴일 제외)
        </li>
        <li className="text-indent-[-1rem] list-inside list-disc text-[0.75rem] text-neutral-500">
          1:1 문의 접수 내역은 관련 규정에 따라 회원탈퇴일로부터 3년간 안전하게
          보관됩니다.
        </li>
        <li className="text-indent-[-1rem] list-inside list-disc text-[0.75rem] text-neutral-500">
          욕설, 비방, 악의적인 목적의 문의는 답변이 제한되거나 서비스 이용에
          불이익이 발생할 수 있습니다.
        </li>
      </ul>
    </div>
  );
}
