import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Experience from "@/components/Experience";
import resumeData from "@/data/resume.json";
import type { ExperienceEntry } from "@/lib/types";

const experience = resumeData.experience as ExperienceEntry[];

describe("Experience component", () => {
  beforeEach(() => {
    render(<Experience experience={experience} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /professional experience/i })
    ).toBeInTheDocument();
  });

  it("renders all company names", () => {
    const companies = [...new Set(experience.map((j) => j.company))];
    companies.forEach((company) => {
      expect(screen.getAllByText(company).length).toBeGreaterThan(0);
    });
  });

  it("renders all job titles", () => {
    experience.forEach((job) => {
      expect(screen.getAllByText(job.title).length).toBeGreaterThan(0);
    });
  });

  it("marks the current job with a 'Current' badge", () => {
    expect(screen.getByText("Current")).toBeInTheDocument();
  });

  it("first job is expanded by default (shows bullets)", () => {
    const firstJob = experience[0];
    // first bullet of first job should be visible
    if (firstJob.bullets.length > 0) {
      expect(screen.getByText(firstJob.bullets[0])).toBeInTheDocument();
    }
  });

  it("second job is collapsed by default (bullets hidden)", () => {
    const secondJob = experience[1];
    if (secondJob.bullets.length > 0) {
      // The hidden attribute hides content from the DOM
      const details = screen.queryByText(secondJob.bullets[0]);
      // Either not in DOM or inside a hidden element
      if (details) {
        expect(details.closest("[hidden]")).toBeTruthy();
      }
    }
  });

  it("expands a collapsed job when clicked", async () => {
    const user = userEvent.setup();
    const secondJob = experience[1];
    // Find expand button for second job
    const buttons = screen.getAllByRole("button");
    // Second button corresponds to second job
    await user.click(buttons[1]);
    if (secondJob.bullets.length > 0) {
      expect(screen.getByText(secondJob.bullets[0])).toBeVisible();
    }
  });
});
