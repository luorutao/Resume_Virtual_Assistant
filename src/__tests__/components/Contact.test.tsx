import { render, screen } from "@testing-library/react";
import Contact from "@/components/Contact";
import resumeData from "@/data/resume.json";
import type { PersonalInfo } from "@/lib/types";

const personal = resumeData.personal as PersonalInfo;

describe("Contact component", () => {
  beforeEach(() => {
    render(<Contact personal={personal} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /let.*connect/i })
    ).toBeInTheDocument();
  });

  it("renders an email link with correct href", () => {
    const emailLink = screen.getByRole("link", {
      name: new RegExp(personal.email, "i"),
    });
    expect(emailLink).toHaveAttribute("href", `mailto:${personal.email}`);
  });

  it("renders LinkedIn link with target blank", () => {
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute("href", personal.linkedin);
    expect(linkedinLink).toHaveAttribute("target", "_blank");
  });

  it("renders GitHub link with target blank", () => {
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", personal.github);
    expect(githubLink).toHaveAttribute("target", "_blank");
  });

  it("renders Download Resume link", () => {
    const downloadLink = screen.getByRole("link", { name: /download resume/i });
    expect(downloadLink).toHaveAttribute("href", personal.resumePdf);
    expect(downloadLink).toHaveAttribute("download");
  });

  it("renders phone link when phone is present", () => {
    if (personal.phone) {
      const phoneLink = screen.getByRole("link", {
        name: new RegExp(`call ${personal.name}`, "i"),
      });
      expect(phoneLink).toHaveAttribute("href", expect.stringMatching(/^tel:/));
    }
  });
});
