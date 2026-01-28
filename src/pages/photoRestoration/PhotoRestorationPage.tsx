import { useState } from "react";
import { useNewPostState } from "@/store/useNewPostState.store";
import PhotoSelectPage from "@/pages/photoRestoration/PhotoSelectPage";
import RestorationCanvas from "@/components/photoRestoration/RestorationCanvas";

const PhotoRestorationPage = () => {
  const { files, reset } = useNewPostState();
  const [step, setStep] = useState<"select" | "restore">("select");

  const handleSelectComplete = () => {
    setStep("restore");
  };

  const handleBack = () => {
    reset();
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
