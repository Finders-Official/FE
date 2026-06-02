import type { AgreementTerm, TermsType } from "@/types/auth";

// SERVICE_INFO(인증번호·운영공지 = 트랜잭션 필수 알림)는 BE 필수 약관이지만
// 디자인상 별도 체크박스가 없어 항상 동의 처리한다.
// 디자인의 "알림 수신 동의(선택)" 체크박스는 MARKETING(선택 알림)에 매핑한다.
export const ALWAYS_AGREED_TERMS: TermsType[] = ["SERVICE_INFO"];

export const AGREEMENT_TERMS: AgreementTerm[] = [
  {
    id: "service",
    label: "서비스 이용약관 (필수)",
    required: true,
    agreeTypes: ["SERVICE"],
    groups: [
      {
        heading: "제 1 조 (목적)",
        text: '본 약관은 파인더스(Finders)(이하 "회사")가 제공하는 필름 현상소 정보 및 중개 서비스(이하 "서비스")를 회원이 이용함에 있어 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: "제 2 조 (용어의 정의)",
        ordered: true,
        items: [
          '"회사"란 파인더스 서비스를 운영하는 주체를 말합니다.',
          '"회원"이란 본 약관에 동의하고 카카오 로그인을 통해 서비스에 가입한 자를 말합니다.',
          '"현상소"란 회사와 제휴하여 필름 현상, 스캔 등 용역을 제공하는 업체를 말합니다.',
          '"콘텐츠"란 회원이 서비스 내에 게시한 사진, 글, 댓글 등을 말합니다.',
        ],
      },
      {
        heading: "제 3 조 (약관의 효력 및 변경)",
        text: "본 약관은 회원이 회원가입 시 동의함으로써 효력이 발생하며, 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있습니다.",
      },
      {
        heading: "제 4 조 (제공 서비스)",
        text: "회사는 다음의 서비스를 제공합니다.",
        ordered: true,
        items: [
          "위치 기반 필름 현상소 정보 및 추천 서비스",
          "현상소 예약 및 진행 상태 안내 서비스",
          "필름 사진 커뮤니티 및 회원 간 상호작용 기능",
          "카카오 알림톡을 통한 진행 상태 및 안내 알림",
        ],
      },
      {
        heading: "제 5 조 (중개 서비스의 책임 한계)",
        ordered: true,
        items: [
          "회사는 회원과 현상소 간의 거래를 중개하는 플랫폼이며, 현상 용역의 직접 당사자가 아닙니다.",
          "필름의 분실, 손상, 결과물 품질에 대한 책임은 현상소에 있습니다.",
        ],
      },
      {
        heading: "제 6 조 (콘텐츠의 권리)",
        ordered: true,
        items: [
          "회원이 게시한 콘텐츠의 저작권은 회원에게 귀속됩니다.",
          "회사는 서비스 운영, 홍보 목적 범위 내에서 콘텐츠를 활용할 수 있습니다.",
        ],
      },
    ],
  },
  {
    id: "privacy",
    label: "개인정보 수집·이용 동의 (필수)",
    required: true,
    agreeTypes: ["PRIVACY"],
    groups: [
      {
        heading: "수집항목",
        items: [
          "카카오 계정 정보: 이름, 카카오 닉네임, 프로필 이미지, 카카오계정(이메일)",
          "연락처",
          "서비스 이용 기록",
          "위치정보 (현상소 추천 목적)",
        ],
      },
      {
        heading: "이용 목적",
        items: [
          "회원 식별 및 서비스 제공",
          "예약 및 진행 상태 안내",
          "고객 문의 응대",
        ],
      },
      {
        heading: "보유 및 이용 기간",
        items: [
          "회원 탈퇴 시까지",
          "관련 법령에 따라 보존이 필요한 경우 해당 기간까지",
        ],
        note: "※ 회원은 동의를 거부할 권리가 있으나, 필수 항목 미동의 시 서비스 이용이 제한됩니다.",
      },
    ],
  },
  {
    id: "notification",
    label: "알림 수신 동의 (선택)",
    required: false,
    agreeTypes: ["MARKETING"],
    groups: [
      {
        heading: "필수 알림 (동의 필수)",
        items: ["서비스 운영 관련 공지", "인증번호 수신"],
      },
      {
        heading: "선택 알림 (선택)",
        items: ["이벤트, 프로모션, 신규 기능 안내"],
      },
    ],
  },
  {
    id: "location",
    label: "위치정보 이용 동의 (선택)",
    required: false,
    agreeTypes: ["LOCATION"],
    groups: [
      {
        heading: "수립 목적",
        items: ["회원 위치 기반 현상소 추천", "서비스 품질 개선"],
      },
      {
        heading: "보유 기간",
        items: ["목적 달성 후 즉시 파기 또는 회원 탈퇴 시까지"],
        note: "※ 위치정보는 서비스 제공 목적 외에는 이용되지 않습니다.",
      },
    ],
  },
];
