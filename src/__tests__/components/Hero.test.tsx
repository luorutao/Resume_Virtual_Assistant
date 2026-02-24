import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";
import resumeData from "@/data/resume.json";
import type { ResumeData } from "@/lib/types";

const data = resumeData as ResumeData;

describe("Hero component", () => {
  beforeEach(() => {
    render(<Hero data={data} />);
  });

  it("renders the person's name", () => {
    expect(screen.getByText("Rutao Luo")).toBeInTheDocument();
  });

  it("renders the person's title", () => {
    expect(screen.getByText(data.personal.title)).toBeInTheDocument();
  });

  it("renders an Email Me button linking to the correct email", () => {
    const emailLink = screen.getByRole("link", { name: /send email/i });
    expect(emailLink).toHaveAttribute("href", `mailto:${data.personal.email}`);
  });

  it("renders the Download Resume button with correct href", () => {
    const downloadBtn = screen.getByRole("link", { name: /download resume/i });
    expect(downloadBtn).toHaveAttribute("href", "/Resume_Rutao_Luo.pdf");
    expect(downloadBtn).toHaveAttribute("download");
  });

  it("renders the LinkedIn button", () => {
    const linkedinBtn = screen.getByRole("link", { name: /view linkedin profile/i });
    expect(linkedinBtn).toHaveAttribute("href", data.personal.linkedin);
    expect(linkedinBtn).toHaveAttribute("target", "_blank");
  });

  it("renders the GitHub button", () => {
    const githubBtn = screen.getByRole("link", { name: /view github profile/i });
    expect(githubBtn).toHaveAttribute("href", data.personal.github);
    expect(githubBtn).toHaveAttribute("target", "_blank");
  });

  it("renders stats", () => {
    if (data.stats && data.stats.length > 0) {
      data.stats.forEach((stat) => {
        expect(screen.getByText(stat.value)).toBeInTheDocument();
        expect(screen.getByText(stat.label)).toBeInTheDocument();
      });
    }
  });

  it("has the home section landmark", () => {
    const section = screen.getByRole("region", { name: /introduction/i });
    expect(section).toBeInTheDocument();
  });
});
