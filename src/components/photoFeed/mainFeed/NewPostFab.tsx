import { FloatingIcon } from "@/assets/icon";
import { Press } from "@/components/common";

interface NewPostFabProps {
  onClick: () => void;
}

export default function NewPostFab({ onClick }: NewPostFabProps) {
  return (
    <Press
      type="button"
      aria-label="새 게시물 작성"
      onClick={onClick}
      className="fixed right-6 bottom-[calc(var(--tabbar-height)+var(--fab-gap))] z-50 flex h-[3.5625rem] w-[3.5625rem]"
    >
      <FloatingIcon className="h-[3.5625rem] w-[3.5625rem]" />
    </Press>
  );
}
