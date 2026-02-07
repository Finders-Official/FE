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
  previewUrls: string[];
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
  previewUrls: [] as string[],
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
    // 1) 즉시 files + previewUrls 먼저 넣기 (가드 통과용)
    const urls = files.map((file) => URL.createObjectURL(file));

    // 이전 urls 정리
    const prevUrls = useNewPostState.getState().previewUrls;
    prevUrls.forEach((u) => URL.revokeObjectURL(u));

    set({ files, previewUrls: urls, imageMetas: [] });

    // 2) metas는 비동기로 나중에 채우기
    const metas = await Promise.all(files.map(getImageSize));

    // 사용자가 그 사이에 다시 파일을 바꿨으면(레이스) 덮어쓰지 않게 체크
    const stillSame = useNewPostState.getState().files === files;
    if (!stillSame) return;

    set({ imageMetas: metas });
  },

  setIsSelfDeveloped: (isSelfDeveloped) => set({ isSelfDeveloped }),
  setLabInfo: (labId, labName) => set({ labId, labName }),
  setReviewContent: (reviewContent) => set({ reviewContent }),

  setIsNewPost: (isNewPost) => set({ isNewPost }),

  reset: () => set(initialState),
}));
