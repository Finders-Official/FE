import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { reportContent } from "@/apis/photoFeed/report.api";
import type { ReportRequest } from "@/apis/photoFeed/report.api";

/**
 * 게시글/댓글 신고 mutation
 */
export function useReportContent(
  options?: UseMutationOptions<boolean, Error, ReportRequest>,
) {
  return useMutation<boolean, Error, ReportRequest>({
    mutationKey: ["report"],
    mutationFn: reportContent,
    ...options,
  });
}
