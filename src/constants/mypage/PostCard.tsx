import { HeartIcon } from "@/assets/icon";
import type { Post } from "@/types/mypage/post";
import { Link } from "react-router";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  return (
    <div>
      <Link to={`/post/${post.id}`} className="">
        <img
          src={post.src}
          alt={post.title}
          className="h-[14.25rem] w-[11.25rem] overflow-hidden rounded-md"
        />
      </Link>
      <h1 className="truncate py-1">{post.title}</h1>
      <section className="flex items-center gap-1">
        <p className="flex-1 text-sm text-neutral-400">{post.date}</p>
        <button>
          <HeartIcon className="h-[1rem] w-[1rem]" fill="orange-500" />
        </button>
        <p className="text-sm">{post.likes}</p>
      </section>
    </div>
  );
};
