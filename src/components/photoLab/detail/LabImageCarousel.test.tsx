import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { photoLabPlaceholder } from "@/assets/images";
import LabImageCarousel from "./LabImageCarousel";

describe("LabImageCarousel", () => {
  it("이미지가 없으면 준비중 플레이스홀더를 보여준다", () => {
    render(<LabImageCarousel images={[]} altPrefix="가로다랩" />);

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", photoLabPlaceholder);
  });

  it("이미지가 있으면 그 이미지들을 보여준다", () => {
    const images = ["https://example.com/a.jpg", "https://example.com/b.jpg"];
    render(<LabImageCarousel images={images} altPrefix="연남필름" />);

    const imgs = screen.getAllByRole("img");
    expect(imgs.map((el) => el.getAttribute("src"))).toEqual(images);
  });
});
