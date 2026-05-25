import { CameraIcon, MyPageFilmIcon, PlusIcon } from "@/assets/icon";
import { InputForm } from "@/components/auth";
import { Checkbox, CTA_Button } from "@/components/common";
import { DialogBox } from "@/components/common/DialogBox";
import { DeviceItem, SpecButton } from "@/components/mypage";
import { useState } from "react";

type Step = "LIST" | "REGISTER";

export function DeviceRegisterPage() {
  const [step, setStep] = useState<Step>("LIST");
  return (
    <div className="flex h-full flex-1 flex-col">
      {step === "LIST" ? (
        <ListView onGoToRegister={() => setStep("REGISTER")} />
      ) : (
        <RegisterView onSubmit={() => setStep("LIST")} />
      )}
    </div>
  );
}

function ListView({ onGoToRegister }: { onGoToRegister: () => void }) {
  const [showDialog, setShowDialog] = useState(false);
  const handleEdit = () => alert("수정 페이지로 이동!"); // TODO: 수정 버튼 누를 시 REGISTER 로 스텝 변경후 기존 값 유지
  const handleDelete = () => {
    setShowDialog(true);
  };
  return (
    <>
      <header className="pt-1 pb-4">
        <CTA_Button
          text="장비 신규 등록"
          size="xlarge"
          color="gray"
          icon={PlusIcon}
          onClick={onGoToRegister}
        />
      </header>
      <main className="border-neutral-850 flex flex-1 flex-col border-t-4 py-4">
        <DeviceItem
          title="내 최애 조합"
          isDefault={true}
          cameraName="Nikon 28Ti"
          filmName="Kodak Gold 100"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        {/* <div className="flex flex-1 items-center justify-center">
                <EmptyOrderState description="내가 쓰는 카메라와 필름 정보를 \n 등록해보세요"/>
            </div> */}
        <DialogBox
          isOpen={showDialog}
          title="이 장비를 삭제하시겠어요?"
          description="삭제할 경우 다시 추가해야 합니다.\n 그래도 삭제하시겠습니까?"
          confirmText="네"
          onConfirm={() => setShowDialog(false)} // TODO: 삭제 API
          cancelText="아니오"
          onCancel={() => setShowDialog(false)}
        />
      </main>
    </>
  );
}

function RegisterView({ onSubmit }: { onSubmit: () => void }) {
  //     const [cameraName, setCameraName] = useState<string>("");
  //   const [filmName, setFilmName] = useState<string>("");
  //   const [title, setTitle] = useState<string>("");

  // TODO: 바텀시트 온오프 및 종류 제어를 위한 가상 상태 (State) + 연관 검색어
  //   const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  //   const [bottomSheetType, setBottomSheetType] = useState<"camera" | "film" | null>(null);

  // 버튼 클릭 시 각각의 바텀시트 열기 트리거
  const openCameraBottomSheet = () => {
    // setBottomSheetType("camera");
    // setIsBottomSheetOpen(true);
  };

  const openFilmBottomSheet = () => {
    // setBottomSheetType("film");
    // setIsBottomSheetOpen(true);
  };
  const [click, setClick] = useState(false);
  const handleClick = () => {
    if (click === true) {
      setClick(false);
    } else setClick(true);
  };
  return (
    <>
      <main className="flex flex-1 flex-col gap-8">
        <section className="flex gap-1.5">
          <SpecButton
            label="카메라 기종 선택"
            selectedName={""} //camerName이 들어가야 함
            Icon={CameraIcon}
            onClick={openCameraBottomSheet}
          />
          <SpecButton
            label="필름 기종 선택"
            selectedName={""} // fileName이 들어가야 함
            Icon={MyPageFilmIcon}
            onClick={openFilmBottomSheet}
          />
        </section>
        <section>
          <InputForm
            name="장비 별명"
            placeholder="어떤 이름으로 저장할까요?"
            size="large"
          />
          <div className="flex gap-2 p-3">
            <Checkbox checked={click} onChange={handleClick} />
            <p className="leading-[155%] font-normal tracking-[-0.0175rem]">
              기본 장비로 설정
            </p>
          </div>
        </section>
      </main>
      <footer className="border-neutral-850 sticky bottom-0 z-10 shrink-0 border-t bg-neutral-900 py-5">
        <CTA_Button
          size="xlarge"
          text="등록하기"
          color="orange"
          onClick={onSubmit} // TODO: api 연동 및 disabled
        />
      </footer>
    </>
  );
}
// TODO: 필름, 카메라 기종 리스트 api 불러오기 + 연관 검색 api or util 구현
