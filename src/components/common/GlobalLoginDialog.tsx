import { useNavigate } from "react-router";
import { DialogBox } from "./DialogBox";
import { useLoginModalStore } from "@/store/useLoginModal.store";

export default function GlobalLoginDialog() {
  const navigate = useNavigate();
  const { isOpen, closeLoginModal, onConfirm } = useLoginModalStore();

  const handleConfirm = () => {
    closeLoginModal();
    if (onConfirm) {
      onConfirm();
    } else {
      navigate("/auth/login");
    }
  };

  return (
    <DialogBox
      isOpen={isOpen}
      title="로그인이 필요한 기능입니다"
      description="로그인하고 더 많은 기능을 사용해 보세요!"
      confirmText="로그인하기"
      onConfirm={handleConfirm}
      onCancel={closeLoginModal}
      align="left"
      confirmButtonStyle="text"
    />
  );
}
