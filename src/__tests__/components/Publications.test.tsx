import { render, screen } from "@testing-library/react";
import Publications from "@/components/Publications";
import resumeData from "@/data/resume.json";
import type { Publication } from "@/lib/types";

const publications = resumeData.publications as Publication[];

describe("Publications component", () => {
  beforeEach(() => {
    render(<Publications publications={publications} />);
  });

  it("renders the section heading", () => {
    expect(
      screen.getByRole("heading", { name: /selected publications/i })
    ).toBeInTheDocument();
  });

  it("renders all publication titles", () => {
    publications.forEach((pub) => {
      expect(screen.getByText(pub.title)).toBeInTheDocument();
    });
  });

  it("renders publication years as tags", () => {
    publications
      .filter((pub) => pub.year)
      .forEach((pub) => {
        expect(screen.getAllByText(String(pub.year)).length).toBeGreaterThan(0);
      });
  });

  it("publications with URLs render as links", () => {
    const linkedPubs = publications.filter((pub) => pub.url);
    linkedPubs.forEach((pub) => {
      const link = screen.getByRole("link", {
        name: new RegExp(pub.title.slice(0, 20), "i"),
      });
      expect(link).toHaveAttribute("href", pub.url);
      expect(link).toHaveAttribute("target", "_blank");
    });
  });

  it("renders nothing when publications list is empty", () => {
    const { container } = render(<Publications publications={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
