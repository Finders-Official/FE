import { create } from "zustand";

type ImageMeta = {
  width: number;
  height: number;
};

/**
 * file에서 width/height 뽑기
 */
export function getImageSize(file: File): Promise<ImageMeta> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}

type NewPostState = {
  title: string;
  content: string;
  files: File[];
  imageMetas: ImageMeta[]; // files와 같은 인덱스

  isSelfDeveloped: boolean;

  labId: number | undefined;
  labName: string | undefined;

  reviewContent: string | undefined;

  isNewPost: boolean;

  /** setters */
  setPostInfo: (title: string, content: string) => void;

  setFiles: (files: File[]) => Promise<void>; // setFiles를 async로 바꿔서 metas도 같이 채움
  setIsSelfDeveloped: (isSelfDeveloped: boolean) => void;
  setLabInfo: (labId: number | undefined, labName: string | undefined) => void;
  setReviewContent: (reviewContent: string | undefined) => void;

  setIsNewPost: (isNewPost: boolean) => void;

  reset: () => void;
};

const initialState = {
  title: "",
  content: "",
  files: [] as File[],
  imageMetas: [] as ImageMeta[],
  isSelfDeveloped: false,
  labId: undefined,
  labName: undefined,
  reviewContent: undefined,
  isNewPost: false,
};

export const useNewPostState = create<NewPostState>((set) => ({
  ...initialState,

  /** setters */
  setPostInfo: (title, content) => set({ title, content }),

  setFiles: async (files) => {
    const metas = await Promise.all(files.map(getImageSize));
    set({ files, imageMetas: metas });
  },

  setIsSelfDeveloped: (isSelfDeveloped) => set({ isSelfDeveloped }),
  setLabInfo: (labId, labName) => set({ labId, labName }),
  setReviewContent: (reviewContent) => set({ reviewContent }),

  setIsNewPost: (isNewPost) => set({ isNewPost }),

  reset: () => set(initialState),
}));
