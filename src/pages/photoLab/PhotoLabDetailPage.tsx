import { useParams, useNavigate } from "react-router";
import { Header } from "@/components/common";

export default function PhotoLabDetailPage() {
  const { photoLabId } = useParams<{ photoLabId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex w-full flex-col">
      <div className="px-4">
        <Header title="파인더스 상도점" showBack onBack={handleBack} />
      </div>

      <main>
        <p className="p-4 text-neutral-100">PhotoLab ID: {photoLabId}</p>
      </main>
    </div>
  );
}
