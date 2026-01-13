export interface GuideContentSection {
  // 주황색 타이틀용, ID 2,3
  heading?: string;

  // 위치 텍스트용, ID 1
  locationHeading?: string;

  subHeading?: string;
  imageUrl: string;
  description: string;
}

export interface FilmCameraGuide {
  id: number;
  title: string;
  summary: string;
  thumbnailUrl: string;
  toc?: string[];
  introText?: string;
  contents?: GuideContentSection[];
}
