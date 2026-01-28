export { getComments, postComment, deleteComment } from "./comment.api";

export { getPosts, createPost, getPostDetail, deletePost } from "./post.api";

export { postLike, deleteLike } from "./reactions.api";

export {
  getPostSearches,
  getRecentSearches,
  deleteRecentSearch,
  deleteAllRecentSearch,
  getRelatedSearches,
  getLabSearches,
} from "./search.api";
