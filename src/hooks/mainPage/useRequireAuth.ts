import { useNavigate, type NavigateOptions } from "react-router";
import { useAuthStore } from "@/store/useAuth.store";
import { useLoginModalStore } from "@/store/useLoginModal.store";

export const useRequireAuth = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const openLoginModal = useLoginModalStore((state) => state.openLoginModal);

  const requireAuth = (callback?: () => void) => {
    if (user) {
      if (callback) callback();
    } else {
      openLoginModal();
    }
  };

  const requireAuthNavigate = (path: string, options?: NavigateOptions) => {
    requireAuth(() => navigate(path, options));
  };

  return { requireAuth, requireAuthNavigate };
};
