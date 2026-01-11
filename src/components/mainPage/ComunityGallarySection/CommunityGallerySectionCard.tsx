import { useState } from "react";
import { useNavigate } from "react-router";

export interface CommunityPost {
  id: number;
  thumbnail: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean; // 초기 좋아요 상태
}

interface CommunityGallerySectionCardProps {
  post: CommunityPost;
}

export default function CommunityGallerySectionCard({
  post,
}: CommunityGallerySectionCardProps) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked);

  // 카드 본문 클릭 시 상세 페이지 이동
  const handleCardClick = () => {
    navigate(`/community/post/${post.id}`);
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
    setIsLiked((prev) => !prev); // 토글 상태 변경
    // TODO: API 호출 로직 추가
  };

  // 댓글 버튼 클릭 핸들러
  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/community/post/${post.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group bg-neutral-875 flex w-66.25 cursor-pointer flex-col overflow-hidden rounded-2xl"
    >
      {/* 썸네일 이미지 1:1 비율 */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-800">
        <img
          src={post.thumbnail}
          alt="게시글 썸네일"
          className="h-full w-full object-cover"
        />
      </div>

      {/*  하단 정보 영역 */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          {/* 좋아요 버튼 */}
          <button
            onClick={handleLikeClick}
            className="flex items-center justify-center transition-transform active:scale-90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z"
                className={`transition-colors duration-200 ${
                  isLiked
                    ? "fill-orange-500 stroke-orange-500"
                    : "fill-none stroke-neutral-200"
                }`}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* 댓글 버튼 */}
          <button
            onClick={handleCommentClick}
            className="flex items-center justify-center transition-transform active:scale-90"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* 캡션 (2줄 제한) */}
        <p className="font-regular line-clamp-2 text-[12px] leading-[126%] tracking-[-0.02em] text-neutral-100">
          {post.caption}
        </p>
      </div>
    </div>
  );
}

// 아이콘 수정
// w-66.25 수정
