import { useQuery } from "@tanstack/react-query";
import {
  fetchCommunityPosts,
  fetchPopularLabs,
} from "@/apis/mainPage/mainPage.api";

export const useCommunityPostsQuery = () => {
  return useQuery({
    queryKey: ["community", "posts", "preview"],
    queryFn: fetchCommunityPosts,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePopularLabsQuery = () => {
  return useQuery({
    queryKey: ["labs", "popular"],
    queryFn: fetchPopularLabs,
  });
};
