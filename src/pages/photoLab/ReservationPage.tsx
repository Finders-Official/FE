import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router";
import { Header } from "@/components/common";

interface LocationState {
  labName?: string;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const labName = state?.labName ?? "현상소";

  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return (
    <div className="flex w-full flex-col">
      <Header title={labName} showBack onBack={handleBack} />

      <main className="pb-32"></main>
    </div>
  );
}
