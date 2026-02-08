export type WithdrawBlockMessage = {
  title: string;
  description: string;
};

export const WITHDRAW_BLOCK_MESSAGE_BY_CODE: Record<
  string,
  WithdrawBlockMessage
> = {
  MEMBER_440: {
    title: "아직 방문 예정인 예약이 남아있어요.",
    description: "현재 예약된 내역이 있어 탈퇴 처리가 불가능합니다.",
  },
  MEMBER_441: {
    title: "소중한 필름이 현재 작업 중이에요.",
    description: "진행 중인 작업이 모두 완료된 후에 탈퇴가 가능합니다.",
  },
  MEMBER_442: {
    title: "답변 대기 중인 문의가 있어 탈퇴할 수 없어요.",
    description:
      "답변 대기 중인 문의가 있습니다. 답변 확인 후 탈퇴가 가능합니다.",
  },
} as const;

export const DEFAULT_WITHDRAW_ERROR_MESSAGE: WithdrawBlockMessage = {
  title: "탈퇴 처리 중 오류가 발생했어요",
  description: "잠시 후 다시 시도해 주세요.",
};

export function getWithdrawMessageByCode(code?: string): WithdrawBlockMessage {
  if (!code) return DEFAULT_WITHDRAW_ERROR_MESSAGE;
  return WITHDRAW_BLOCK_MESSAGE_BY_CODE[code] ?? DEFAULT_WITHDRAW_ERROR_MESSAGE;
}
