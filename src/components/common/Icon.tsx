import type { ReactNode } from "react";

/**
 * Icon - SVG 아이콘을 감싸는 래퍼 컴포넌트
 *
 * @description
 * SVG 아이콘에 일관된 크기와 정렬을 적용하는 래퍼
 * 컨테이너 크기와 내부 SVG 크기를 함께 관리하여 터치 영역 확보 및 정렬을 담당
 * 특정 크기가 필요한 경우가 있어, SVG수정을 하지 않고 사용하기 위해 만들어짐
 *
 * @usage
 * 1. 아이콘에 일관된 크기를 적용할 때 (sm/md/lg)
 * 2. 아이콘 색상을 text-* 클래스로 변경할 때
 * 3. 버튼 내부에서 아이콘을 중앙 정렬할 때
 *
 *
 * @example
 * // 기본 사용 (md: 24px 컨테이너, 16px 아이콘)
 * <Icon><ArrowLeftIcon /></Icon>
 *
 * // 크기 변경
 * <Icon size="sm"><CloseIcon /></Icon>  // 16px 컨테이너, 12px 아이콘
 * <Icon size="lg"><MenuIcon /></Icon>   // 32px 컨테이너, 24px 아이콘
 *
 * // 색상 변경 (text-* 클래스 사용)
 * <Icon className="text-orange-500"><BellIcon /></Icon>
 * <Icon className="text-neutral-200"><ArrowLeftIcon /></Icon>
 */
type IconSize = "sm" | "md" | "lg";

interface IconProps {
  children: ReactNode;
  size?: IconSize;
  className?: string;
}

const sizeMap: Record<IconSize, string> = {
  sm: "h-4 w-4 [&>svg]:h-3 [&>svg]:w-3", // 16px container, 12px icon
  md: "h-6 w-6 [&>svg]:h-4 [&>svg]:w-4", // 24px container, 16px icon
  lg: "h-8 w-8 [&>svg]:h-6 [&>svg]:w-6", // 32px container, 24px icon
};

export default function Icon({
  children,
  size = "md",
  className = "",
}: IconProps) {
  return (
    <span
      className={`inline-flex items-center justify-center ${sizeMap[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export type { IconProps, IconSize };
