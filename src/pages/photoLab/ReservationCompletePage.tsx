import { useNavigate, useLocation, useParams } from "react-router";
import { Header } from "@/components/common";
import { LabLocationSection } from "@/components/photoLab/detail";
import {
  ReservationSuccessMessage,
  ReservationDetailSection,
} from "@/components/photoLab/reservation";
import { XMarkIcon } from "@/assets/icon";

// Mock data - 추후 API로 연동
const MOCK_DATA = {
  schedule: "2025. 12. 12(금) 오전 11:00",
  estimatedCompletion: "2025. 12. 12(금) 오후 3:00",
  taskSummary: "현상 • 스캔 • 2롤",
  memo: "안녕하세요. 처음으로 현상 맡깁니다.\n친절하게 안내해주세요!",
  labMessage:
    "예약이 확정되었습니다. 당일취소 불가능하며 1시간 전 연락주시면 일정 변경 가능합니다. 감사합니다:)",
  location: {
    address: "서울 동작구 상도로 00길 00",
    distanceKm: 1.5,
    coordinates: {
      latitude: 37.50287963116875,
      longitude: 126.94790892178148,
    },
  },
};

interface LocationState {
  labName?: string;
}

export default function ReservationCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { photoLabId } = useParams();

  const state = location.state as LocationState | null;
  const labName = state?.labName ?? "파인더스 상도점";

  const handleClose = () => {
    navigate(`/photolab/${photoLabId}`, { replace: true });
  };

  return (
    <div className="flex w-full flex-col">
      <Header
        title={labName}
        rightAction={{
          type: "icon",
          icon: <XMarkIcon className="h-3.5 w-3.5 text-neutral-200" />,
          onClick: handleClose,
        }}
      />

      <main className="pb-32">
        <ReservationSuccessMessage />

        <ReservationDetailSection
          schedule={MOCK_DATA.schedule}
          estimatedCompletion={MOCK_DATA.estimatedCompletion}
          taskSummary={MOCK_DATA.taskSummary}
          memo={MOCK_DATA.memo}
          labMessage={MOCK_DATA.labMessage}
          labName={labName}
        />

        <LabLocationSection
          address={MOCK_DATA.location.address}
          distanceKm={MOCK_DATA.location.distanceKm}
          location={MOCK_DATA.location.coordinates}
          labName={labName}
        />
      </main>
    </div>
  );
}
