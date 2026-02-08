import { useCallback, useState } from "react";
import { downloadImageFromUrl } from "@/utils/photoRestoration/downloadImage";

type Params = {
  restoredImageUrl: string | null;
  isGenerating: boolean;
};

export function useRestorationSave({ restoredImageUrl, isGenerating }: Params) {
  const [isSaving, setIsSaving] = useState(false);
  const save = useCallback(async (): Promise<boolean> => {
    if (!restoredImageUrl || isGenerating || isSaving) {
      return false;
    }

    try {
      setIsSaving(true);
      await downloadImageFromUrl(restoredImageUrl, "finders-restored.png");
      return true;
    } catch (e) {
      console.error("이미지 저장 실패", e);
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [restoredImageUrl, isGenerating, isSaving]);

  return { isSaving, save };
}
