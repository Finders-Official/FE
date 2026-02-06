// TODO: daum.Postcode → kakao.Postcode 네임스페이스 마이그레이션 예정 (2026년 3월)
// CDN: t1.daumcdn.net → t1.kakaocdn.net, 도메인: postcode.map.daum.net → postcode.map.kakao.com
// 참고: https://github.com/daumPostcode/QnA/issues/1498
import DaumPostcodeEmbed from "react-daum-postcode";
import type { Address as DaumAddress } from "react-daum-postcode";
import { Header } from "@/components/common";

interface DaumAddressSearchProps {
  open: boolean;
  onClose: () => void;
  onComplete: (data: { zipcode: string; address: string }) => void;
}

export function DaumAddressSearch({
  open,
  onClose,
  onComplete,
}: DaumAddressSearchProps) {
  const handleComplete = (data: DaumAddress) => {
    onComplete({
      zipcode: data.zonecode,
      address: data.roadAddress || data.jibunAddress,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-900">
      <Header title="주소 입력하기" showBack onBack={onClose} />
      <div className="min-h-0 flex-1">
        <DaumPostcodeEmbed
          onComplete={handleComplete}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
