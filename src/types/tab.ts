import React from "react";

export type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export type TabItem = {
  to: string;
  label: string;
  icon: IconComponent;
  activeIcon: IconComponent;
  end?: boolean;
};

//tabbar 카테고리에 사용되는 type을 지정
