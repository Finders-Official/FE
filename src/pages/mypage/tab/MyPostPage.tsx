import { PostCard } from "@/components/mypage";
import { posts } from "@/constants/mypage/post.constant";

export function MyPostPage() {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-10 py-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </div>
  );
}
