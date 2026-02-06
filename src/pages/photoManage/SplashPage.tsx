import { SplashIcon, PencilLineIcon } from "@/assets/icon";
import { ActionButton } from "@/components/photoManage/ActionButton";
import { useNavigate } from "react-router";

export default function SplashPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/photoFeed"); // TODO: 정확히 어디로 갈지 PM님께 여쭤봄
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 pb-15 text-center">
        <SplashIcon className="h-32 w-32" />
        <div className="flex flex-col gap-5">
          <h2 className="font-5 whitespace-pre-line text-white">
            {`파인더스를 이용해
          현상을 진행해주셔서 감사해요!`}
          </h2>
          <ActionButton
            leftIcon={
              <PencilLineIcon className="text-orange-450 h-4.5 w-4.5" />
            }
            message={"현상한 사진 자랑하러 가기"}
            showNext={true}
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
}
