import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useState } from "react";
import { getCurrentWork } from "@/apis/photoManage/currentWork.api";

export const useCurrentWorkNavigation = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  const { refetch } = useQuery({
    queryKey: ["currentWork"],
    queryFn: getCurrentWork,
    enabled: false,
  });

  const handleNavigationClick = async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const { data: response } = await refetch();
      if (response?.data) {
        navigate("/photoManage/main");
      } else {
        navigate("/development-history");
      }
    } catch (error) {
      console.error("현재 작업 상태를 확인하는 중 오류가 발생했습니다:", error);
      navigate("/development-history");
    } finally {
      setIsChecking(false);
    }
  };

  return { handleNavigationClick, isChecking };
};
