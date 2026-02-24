import { render, screen } from "@testing-library/react";
import Skills from "@/components/Skills";
import resumeData from "@/data/resume.json";
import type { SkillGroup } from "@/lib/types";

const skills = resumeData.skills as SkillGroup[];

describe("Skills component", () => {
  beforeEach(() => {
    render(<Skills skills={skills} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /technical skills/i })
    ).toBeInTheDocument();
  });

  it("renders all skill category headings", () => {
    skills.forEach((group) => {
      expect(screen.getByText(group.category)).toBeInTheDocument();
    });
  });

  it("renders skill items as tags", () => {
    // Check a sample of known skills
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("AWS")).toBeInTheDocument();
  });

  it("renders the correct number of category cards", () => {
    // Each skill card has role="region" with aria-labelledby starting with "skill-cat-"
    const cards = screen
      .getAllByRole("region")
      .filter((el) => el.getAttribute("aria-labelledby")?.startsWith("skill-cat-"));
    expect(cards.length).toBe(skills.length);
  });
});
