import { getInquiries } from "@/apis/my";
import { useQuery } from "@tanstack/react-query";

export const useInquiries = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ["inquiries", page, size],
    queryFn: () => getInquiries(page, size),
  });
};
