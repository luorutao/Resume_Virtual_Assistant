import { render, screen } from "@testing-library/react";
import BeyondWork from "@/components/BeyondWork";
import resumeData from "@/data/resume.json";
import type { BeyondWork as BeyondWorkType } from "@/lib/types";

const beyondWork = resumeData.beyondWork as BeyondWorkType;

describe("BeyondWork component", () => {
  beforeEach(() => {
    render(<BeyondWork beyondWork={beyondWork} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /beyond work/i })
    ).toBeInTheDocument();
  });

  it("renders all paragraphs", () => {
    beyondWork.paragraphs.forEach((para) => {
      expect(screen.getByText(para)).toBeInTheDocument();
    });
  });

  it("has the correct section landmark", () => {
    expect(
      screen.getByRole("region", { name: /beyond work/i })
    ).toBeInTheDocument();
  });
});
