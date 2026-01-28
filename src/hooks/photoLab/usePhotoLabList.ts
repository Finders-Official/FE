import { useInfiniteQuery } from "@tanstack/react-query";
import { getPhotoLabList } from "@/api/photoLab";
import type {
  PhotoLabListParams,
  PagedApiResponse,
  PhotoLabItem,
} from "@/types/photoLab";

type Params = Omit<PhotoLabListParams, "page" | "size">;

export function usePhotoLabList(params: Params, enabled = true) {
  return useInfiniteQuery<PagedApiResponse<PhotoLabItem[]>, Error>({
    queryKey: ["photoLab", "list", params],
    queryFn: ({ pageParam }) =>
      getPhotoLabList({
        ...params,
        page: pageParam as number,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
