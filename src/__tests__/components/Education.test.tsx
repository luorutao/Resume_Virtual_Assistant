import { render, screen } from "@testing-library/react";
import Education from "@/components/Education";
import resumeData from "@/data/resume.json";
import type { EducationEntry, Certification } from "@/lib/types";

const education = resumeData.education as EducationEntry[];
const certifications = resumeData.certifications as Certification[];

describe("Education component", () => {
  beforeEach(() => {
    render(<Education education={education} certifications={certifications} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /education.*certifications/i })
    ).toBeInTheDocument();
  });

  it("renders all degrees", () => {
    education.forEach((edu) => {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    });
  });

  it("renders all schools", () => {
    education.forEach((edu) => {
      expect(screen.getAllByText(edu.school).length).toBeGreaterThan(0);
    });
  });

  it("renders all certifications", () => {
    certifications.forEach((cert) => {
      expect(screen.getByText(cert.name)).toBeInTheDocument();
    });
  });
});
