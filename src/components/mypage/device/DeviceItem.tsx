import { CameraIcon, MyPageFilmIcon } from "@/assets/icon";
import { Press } from "@/components/common";

interface EquipmentCardProps {
  title: string;
  isDefault?: boolean;
  cameraName: string;
  filmName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function DeviceItem({
  title = "내 최애 조합",
  isDefault = true,
  cameraName = "Nikon 28Ti",
  filmName = "Kodak Gold 100",
  onEdit,
  onDelete,
}: EquipmentCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-neutral-800 p-4 shadow-sm">
      {/* 상단: 타이틀 및 기본 장비 태그 */}
      <div className="mb-5 flex items-center gap-3">
        <h3 className="text-[1.25rem] font-normal tracking-tight text-neutral-100">
          {title}
        </h3>
        {isDefault && (
          <span className="bg-orange-450 rounded-sm px-1 py-0.5 text-[0.7rem] font-normal text-neutral-100">
            기본 장비
          </span>
        )}
      </div>

      {/* 중단: 카메라 및 필름 정보 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        {/* 카메라 정보 */}
        <div className="flex items-center gap-3 text-neutral-100">
          <CameraIcon className="h-4 w-4 shrink-0" />
          <span className="truncate text-[0.9rem] font-normal">
            {cameraName}
          </span>
        </div>
        {/* 필름 정보 */}
        <div className="flex items-center gap-3 text-neutral-100">
          <MyPageFilmIcon className="h-4 w-4 shrink-0" />
          <span className="truncate text-[0.9rem] font-normal">{filmName}</span>
        </div>
      </div>

      {/* 구분선 */}
      <hr className="mb-3 border-neutral-800" />

      {/* 하단: 수정 및 삭제 버튼 */}
      <div className="flex justify-end gap-5 text-base font-medium text-neutral-600">
        <Press onClick={onEdit} className="hover:text-gray-800">
          수정
        </Press>
        <Press onClick={onDelete} className="hover:text-red-500">
          삭제
        </Press>
      </div>
    </div>
  );
}
