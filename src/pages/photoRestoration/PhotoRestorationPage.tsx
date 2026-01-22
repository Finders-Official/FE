import { useState } from "react";
import { useSelectedPhotos } from "@/store/useSelectedPhotos.store";
import PhotoSelectPage from "@/pages/photoRestoration/PhotoSelectPage";
import RestorationCanvas from "@/components/photoRestoration/RestorationCanvas";

const PhotoRestorationPage = () => {
  const { files, clear } = useSelectedPhotos();
  const [step, setStep] = useState<"select" | "restore">("select");

  const handleSelectComplete = () => {
    setStep("restore");
  };

  const handleBack = () => {
    clear();
    setStep("select");
  };

  return (
    <div className="mx-auto h-screen w-full max-w-md bg-neutral-900 text-neutral-100">
      {step === "select" && <PhotoSelectPage onSelect={handleSelectComplete} />}

      {step === "restore" && files.length > 0 && (
        <RestorationCanvas file={files[0]} onBack={handleBack} />
      )}
    </div>
  );
};

export default PhotoRestorationPage;
