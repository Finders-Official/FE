import { useCallback, useEffect, useRef, useState } from "react";
import {
  CameraIcon,
  CheckCircleIcon,
  MyPageFilmIcon,
  PlusIcon,
} from "@/assets/icon";
import { InputForm } from "@/components/auth";
import {
  Checkbox,
  CTA_Button,
  PageSlide,
  Press,
  SearchBar,
  StaggerItem,
  Toast,
} from "@/components/common";
import { DialogBox } from "@/components/common/DialogBox";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyOrderState } from "@/components/mypage";
import { DeviceItem, SpecButton } from "@/components/mypage";

import { useInfiniteScroll } from "@/hooks/common/useInfiniteScroll";
import { useFirstPageStagger } from "@/hooks/common/useFirstPageStagger";
import type { EquipmentItem } from "@/types/mypage/device";
import {
  useCamerasInfinite,
  useDeleteDevice,
  useDeviceListInfinite,
  useFilmsInfinite,
  useCreateDevice,
  useUpdateDevice,
} from "@/hooks/my";
import BottomSheet from "@/components/common/BottomSheet";
import { useDebouncedValue } from "@/hooks/common";
import { useOutletContext } from "react-router";
import type { MyPageOutletContext } from "@/layouts/MyPageLayout";

type Step = "LIST" | "REGISTER";

export function DeviceRegisterPage() {
  const [step, setStep] = useState<Step>("LIST");
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);

  // 토스트 메시지 상태 관리
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 등록 취소 다이얼로그 상태 추가
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // 부모(Layout)가 내려준 setCustomOnBack 가져오기
  const context = useOutletContext<MyPageOutletContext | null>();
  const setCustomOnBack = context?.setCustomOnBack;

  // tep이 변경될 때마다 뒤로가기 동작을 가로채거나 원상복구
  useEffect(() => {
    if (!setCustomOnBack) return;

    if (step === "REGISTER") {
      // 등록 뷰일 때는 뒤로가기 누르면 다이얼로그 오픈!
      setCustomOnBack(() => () => setIsCancelDialogOpen(true));
    } else {
      // 리스트 뷰일 때는 커스텀 동작 해제 (기본 navigate(-1) 동작으로 복구)
      setCustomOnBack(null);
    }

    // 컴포넌트가 언마운트될 때 안전하게 초기화
    return () => setCustomOnBack(null);
  }, [step, setCustomOnBack]);

  const handleGoToRegister = (item?: EquipmentItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setStep("REGISTER");
  };

  return (
    <div className="relative flex h-full flex-1 flex-col">
      <PageSlide
        step={step}
        direction={step === "REGISTER" ? "forward" : "back"}
        className="flex flex-1 flex-col"
      >
        {step === "LIST" ? (
          <ListView
            onGoToRegister={() => handleGoToRegister()}
            onGoToEdit={handleGoToRegister}
          />
        ) : (
          <RegisterView
            initialData={editingItem}
            onSubmit={(message) => {
              setToastMessage(message);
              setStep("LIST");
            }}
          />
        )}
      </PageSlide>

      <Toast
        open={!!toastMessage}
        onClose={() => setToastMessage(null)}
        duration={3000}
        placement="above-tab"
        message={toastMessage ?? ""}
        icon={<CheckCircleIcon className="h-5 w-5" />}
      />

      <DialogBox
        isOpen={isCancelDialogOpen}
        title="등록이 완료되지 않았어요"
        description="현재 입력된 정보가 저장되지 않습니다.\n나가시겠습니까?"
        align="left"
        confirmText="네"
        cancelText="아니요"
        onConfirm={() => {
          setIsCancelDialogOpen(false); // 다이얼로그 닫기
          setStep("LIST"); // 리스트 뷰로 이동
        }}
        onCancel={() => setIsCancelDialogOpen(false)} // 다이얼로그만 닫고 유지
      />
    </div>
  );
}

// ==========================================
// 1. 장비 목록 화면 (ListView)
// ==========================================
interface ListViewProps {
  onGoToRegister: () => void;
  onGoToEdit: (item: EquipmentItem) => void;
}
function ListView({ onGoToRegister, onGoToEdit }: ListViewProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [targetId, setTargetId] = useState<string | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDeviceListInfinite(10);
  const { mutate: deleteEquipmentMutate } = useDeleteDevice();

  const equipmentList = data?.pages.flatMap((page) => page.data.items) ?? [];
  const hasEquipments = equipmentList.length > 0;
  const staggerIndexFor = useFirstPageStagger(equipmentList.length);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const onIntersect = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useInfiniteScroll({
    target: bottomRef,
    onIntersect,
    enabled: !isLoading && !isError,
    rootMargin: "200px",
  });

  const handleDeleteClick = (id: string) => {
    setTargetId(id);
    setShowDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!targetId) return;
    setShowDialog(false);
    deleteEquipmentMutate(targetId);
    setTargetId(null);
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

      <main className="border-neutral-850 flex flex-1 flex-col overflow-y-auto border-t-4 py-4">
        {isLoading ? (
          <LoadingSpinner open={isLoading} />
        ) : isError ? (
          <div className="t-fade-in flex flex-1 items-center justify-center text-neutral-400">
            장비 목록을 불러오지 못했습니다.
          </div>
        ) : hasEquipments ? (
          <div className="flex flex-col gap-4">
            {equipmentList.map((item, index) => (
              <StaggerItem
                key={item.combinationId}
                index={staggerIndexFor(index)}
              >
                <DeviceItem
                  title={item.nickname}
                  isDefault={item.isDefault}
                  cameraName={item.camera.name}
                  filmName={item.film.name}
                  onEdit={() => onGoToEdit(item)}
                  onDelete={() => handleDeleteClick(item.combinationId)}
                />
              </StaggerItem>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyOrderState
              description={`내가 쓰는 카메라와 필름 정보를\n등록해보세요`}
            />
          </div>
        )}

        <DialogBox
          isOpen={showDialog}
          title="이 장비를 삭제하시겠어요?"
          description={`삭제할 경우 다시 추가해야 합니다.\n그래도 삭제하시겠습니까?`}
          confirmText="네"
          onConfirm={handleConfirmDelete}
          cancelText="아니오"
          onCancel={() => {
            setShowDialog(false);
            setTargetId(null);
          }}
        />
      </main>
    </>
  );
}

// ==========================================
// 2. 장비 등록/수정 화면 (RegisterView)
// ==========================================
interface RegisterViewProps {
  initialData: EquipmentItem | null;
  onSubmit: (message: string) => void;
}

function RegisterView({ initialData, onSubmit }: RegisterViewProps) {
  // API 전송용 ID를 함께 관리하기 위해 폼 타입 구체화
  const [selectedCamera, setSelectedCamera] = useState<{
    id: string;
    name: string;
  } | null>(
    initialData
      ? { id: initialData.camera.cameraId, name: initialData.camera.name }
      : null,
  );
  const [selectedFilm, setSelectedFilm] = useState<{
    id: string;
    name: string;
  } | null>(
    initialData
      ? { id: initialData.film.filmId, name: initialData.film.name }
      : null,
  );

  const [nickname, setNickname] = useState<string>(initialData?.nickname ?? "");
  const [isDefault, setIsDefault] = useState<boolean>(
    initialData?.isDefault ?? false,
  );

  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);

  // 처리 실패 토스트 메시지
  const [errorToastMessage, setErrorToastMessage] = useState<string | null>(
    null,
  );

  // 바텀시트 제어 상태
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetType, setBottomSheetType] = useState<
    "camera" | "film" | null
  >(null);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebouncedValue(searchValue, 300);

  // 등록 Mutation 훅
  const { mutate: createDeviceMutate, isPending } = useCreateDevice();

  // 수정 Mutation 훅
  const { mutate: updateDeviceMutate, isPending: isUpdating } =
    useUpdateDevice();

  // 기종 리스트 카탈로그 호출 무한스크롤 훅
  const {
    data: cameraData,
    hasNextPage: hasCameraNext,
    fetchNextPage: fetchCameraNext,
    isFetchingNextPage: isCameraFetching,
  } = useCamerasInfinite(debouncedSearchValue, bottomSheetType === "camera");

  const {
    data: filmData,
    hasNextPage: hasFilmNext,
    fetchNextPage: fetchFilmNext,
    isFetchingNextPage: isFilmFetching,
  } = useFilmsInfinite(debouncedSearchValue, bottomSheetType === "film");

  const currentItems =
    bottomSheetType === "camera"
      ? (cameraData?.pages.flatMap((p) => p.data.items) ?? [])
      : (filmData?.pages.flatMap((p) => p.data.items) ?? []);

  const hasNextPage =
    bottomSheetType === "camera" ? hasCameraNext : hasFilmNext;
  const fetchNextPage =
    bottomSheetType === "camera" ? fetchCameraNext : fetchFilmNext;
  const isFetchingNext =
    bottomSheetType === "camera" ? isCameraFetching : isFilmFetching;

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const onIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNext) fetchNextPage();
  }, [hasNextPage, isFetchingNext, fetchNextPage]);

  useInfiniteScroll({ target: bottomRef, onIntersect });

  const openBottomSheet = (type: "camera" | "film") => {
    setBottomSheetType(type);
    setSearchValue("");
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  // 선택 시 이름과 아이디를 세트로 상태 주입
  const handleSelectItem = (id: string, name: string) => {
    if (bottomSheetType === "camera") {
      setSelectedCamera({ id, name });
    } else if (bottomSheetType === "film") {
      setSelectedFilm({ id, name });
    }
    closeBottomSheet();
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error && error.message === "DUPLICATED") {
      setIsDuplicateDialogOpen(true);
      return;
    }

    // 그 외 알 수 없는 에러
    setErrorToastMessage(
      "장비 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
    );
  };

  // 유효성 검사: 카메라, 필름 선택 완료 및 글자수가 입력되었을 때 주황색 활성화
  const isFormValid =
    !!selectedCamera && !!selectedFilm && nickname.trim().length > 0;

  const handleFormSubmit = () => {
    // 유효성 검사 통과 못 했거나 통신중이면 리턴
    if (!isFormValid || isUpdating) return;

    const requestBody = {
      nickname: nickname.trim(),
      isDefault: isDefault,
      cameraId: selectedCamera.id,
      filmId: selectedFilm.id,
    };

    // 초기 데이터에 따른 수정 및 등록 분기
    if (initialData) {
      // PATCH API 가동
      updateDeviceMutate(
        {
          combinationId: initialData.combinationId, // 수정할 타겟 ID
          body: requestBody, // 변경할 데이터
        },
        {
          onSuccess: () => {
            onSubmit("내 장비가 성공적으로 수정되었어요 :)"); // 성공 후 목록(LIST)으로 돌아가기
          },
          onError: handleError,
        },
      );
    } else {
      //  POST API 가동
      createDeviceMutate(requestBody, {
        onSuccess: () => {
          onSubmit("내 장비가 성공적으로 등록되었어요 :)");
        },
        onError: handleError,
      });
    }
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-8 py-4">
        <section className="flex gap-1.5">
          <SpecButton
            label="카메라 기종 선택"
            selectedName={selectedCamera?.name ?? ""}
            Icon={CameraIcon}
            onClick={() => openBottomSheet("camera")}
          />
          <SpecButton
            label="필름 기종 선택"
            selectedName={selectedFilm?.name ?? ""}
            Icon={MyPageFilmIcon}
            onClick={() => openBottomSheet("film")}
          />
        </section>

        <section>
          <InputForm
            name="장비 별명"
            placeholder="어떤 이름으로 저장할까요?"
            size="large"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <div className="flex items-center gap-2 p-3">
            <Checkbox
              checked={isDefault}
              onChange={() => setIsDefault((prev) => !prev)}
            />
            <p className="leading-[155%] font-normal tracking-[-0.0175rem] text-neutral-200">
              기본 장비로 설정
            </p>
          </div>
        </section>
      </main>

      <footer className="border-neutral-850 sticky bottom-0 z-10 shrink-0 border-t bg-neutral-900 py-5">
        <CTA_Button
          size="xlarge"
          text={
            isPending ? "등록 중..." : initialData ? "수정하기" : "등록하기"
          }
          // 유효하고 펜딩(중복 서브밋) 상태가 아닐 때만 orange 컬러 부여
          color={isFormValid && !isPending ? "orange" : "black"}
          onClick={handleFormSubmit}
        />
      </footer>

      {/* 중복 등록 에러 다이얼로그 */}
      <DialogBox
        isOpen={isDuplicateDialogOpen}
        title="이미 등록된 장비 조합이예요"
        description="다른 카메라와 필름 조합을 선택해 주세요."
        align="left"
        confirmText="확인"
        confirmButtonStyle="text"
        onConfirm={() => setIsDuplicateDialogOpen(false)}
      />

      {/* 처리 실패 토스트 */}
      <Toast
        open={!!errorToastMessage}
        onClose={() => setErrorToastMessage(null)}
        duration={3000}
        placement="above-tab"
        message={errorToastMessage ?? ""}
      />

      <BottomSheet
        open={isBottomSheetOpen}
        onClose={closeBottomSheet}
        onExited={() => setBottomSheetType(null)}
      >
        <div className="flex h-full flex-col gap-6 px-4 pt-4">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder={
              bottomSheetType === "camera"
                ? "카메라 기종을 입력해주세요"
                : "필름 기종을 입력해주세요"
            }
            rightIcon="search"
          />
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            {currentItems.length > 0 ? (
              <ul className="flex flex-col">
                {currentItems.map((item) => {
                  const itemId = item.cameraId ?? item.filmId ?? "";
                  return (
                    <Press
                      as="li"
                      key={itemId}
                      className="cursor-pointer border-b border-neutral-800 py-4 text-neutral-200"
                      onClick={() => handleSelectItem(itemId, item.name)}
                    >
                      <p className="font-semibold">
                        {item.company} {item.model}
                      </p>
                    </Press>
                  );
                })}

                <div ref={bottomRef} className="h-4 w-full" />
                {isFetchingNext && (
                  <p className="py-2 text-center text-sm text-neutral-500">
                    로딩 중...
                  </p>
                )}
              </ul>
            ) : (
              <div className="flex h-full items-center justify-center pt-10 text-neutral-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
