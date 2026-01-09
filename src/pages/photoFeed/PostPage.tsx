import {
  HomeIcon,
  CheckCircleIcon,
  HeartIcon,
  ChatBubbleEmptyIcon,
  EllipsisVerticalIcon,
} from "@/assets/icon";
import { ToastItem } from "@/components/common";
import { postMock } from "@/types/post";
import PhotoCarousel from "@/components/photoFeed/PhotoCarousel";
import { useEffect, useState } from "react";

export default function PostPage() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // 1. 1.6초 후 fade-out 시작
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 1600);

    // 2. 3초 후 완전히 제거
    const removeTimer = setTimeout(() => {
      setMounted(false);
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[23.4375rem] py-[1rem]">
      <section className="flex flex-col gap-[10px] pt-10 pb-10">
        {/** 상단 */}
        <div className="flex flex-col gap-[10px]">
          <div className="flex items-center gap-2">
            <img
              src={postMock.user?.avatarUrl}
              alt={postMock.user?.username}
              className="h-9 w-9 rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-neutral-200">
                {postMock.user?.username}
              </p>
              <p className="text-[12px] font-light text-neutral-400">
                {postMock.date}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto inline-flex h-9 w-9 items-center justify-center"
              aria-label="더보기"
              onClick={() => {}}
            >
              <EllipsisVerticalIcon className="h-4 w-[3px]" />
            </button>
          </div>
          <PhotoCarousel
            images={postMock.photoUrl}
            altPrefix={postMock.title}
          />
          <div className="flex h-5 w-full justify-start gap-3 pl-1">
            <div className="flex items-center gap-1">
              <HeartIcon className="h-[20px] w-[22.5px]" />
              <p className="text-[13px]">{postMock.likes}</p>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleEmptyIcon className="h-[20px] w-[20px]" />
              <p className="text-[13px]">{postMock.comments}</p>
            </div>
          </div>
        </div>

        {/** 하단 */}
        <div className="flex flex-col gap-4">
          {/** 게시글 제목 및 내용 */}
          <div className="flex flex-col gap-2">
            <p className="text-semi-bold text-[17px] text-neutral-100">
              {postMock.title}
            </p>
            <p className="text-[15px] text-neutral-300">{postMock.content}</p>
          </div>

          {/** 현상소 후기 */}
          <div className="bg-neutral-875 flex flex-col gap-2 rounded-2xl p-[1.25rem] text-neutral-500">
            <div className="flex items-center gap-2">
              <HomeIcon className="h-4 w-4 font-semibold" />
              <p className="text-[16px] font-semibold text-neutral-200">
                {postMock.lab.name} 이용
              </p>
            </div>
            <p className="text-[14px] text-neutral-200">
              {postMock.lab.review}
            </p>
          </div>
        </div>
      </section>

      {/** toast 메세지 */}
      {mounted && (
        <div className="fixed right-0 bottom-0 left-0 z-50 flex justify-center px-5 py-5">
          <div
            className={`transition-opacity duration-300 ease-out ${
              visible ? "opacity-100" : "opacity-0"
            }`}
          >
            <ToastItem
              message="게시글이 성공적으로 업로드 되었어요 :)"
              icon={<CheckCircleIcon />}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CO-030 PostPage.tsx
 * Description: 게시물 상세보기 페이지
 */
