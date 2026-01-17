import { useNavigate, useLocation, useParams } from "react-router";
import { Header } from "@/components/common";
import { XMarkIcon } from "@/assets/icon";

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

      <main className="pb-32"></main>
    </div>
  );
}
