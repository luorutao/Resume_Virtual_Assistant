/**
 * Resume JSON schema tests
 * Ensures resume.json is well-formed and all required fields are present.
 * Fails fast if the data pipeline produces bad output.
 */

import resume from "@/data/resume.json";

describe("resume.json — schema validation", () => {
  // ── personal ────────────────────────────────────────────────────────────────
  describe("personal", () => {
    it("has a non-empty name", () => {
      expect(resume.personal.name).toBeTruthy();
    });

    it("has a non-empty title", () => {
      expect(resume.personal.title).toBeTruthy();
    });

    it("has a valid email address", () => {
      expect(resume.personal.email).toMatch(/^[\w.+-]+@[\w-]+\.\w+$/);
    });

    it("has a resumePdf path starting with /", () => {
      expect(resume.personal.resumePdf).toMatch(/^\//);
    });

    it("has a valid LinkedIn URL", () => {
      expect(resume.personal.linkedin).toMatch(/^https:\/\/www\.linkedin\.com/);
    });

    it("has a valid GitHub URL", () => {
      expect(resume.personal.github).toMatch(/^https:\/\/github\.com/);
    });
  });

  // ── experience ──────────────────────────────────────────────────────────────
  describe("experience", () => {
    it("has at least one entry", () => {
      expect(resume.experience.length).toBeGreaterThan(0);
    });

    it("every entry has required fields", () => {
      resume.experience.forEach((job) => {
        expect(job.id).toBeTruthy();
        expect(job.title).toBeTruthy();
        expect(job.company).toBeTruthy();
        expect(job.startDate).toBeTruthy();
        expect(job.endDate).toBeTruthy();
        expect(Array.isArray(job.bullets)).toBe(true);
        expect(Array.isArray(job.tags)).toBe(true);
      });
    });

    it("exactly one job is marked current", () => {
      const currentJobs = resume.experience.filter((j) => j.current);
      expect(currentJobs.length).toBe(1);
    });

    it("first (most recent) job is at Domyn", () => {
      expect(resume.experience[0].company).toBe("Domyn");
    });

    it("all job IDs are unique", () => {
      const ids = resume.experience.map((j) => j.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  // ── skills ──────────────────────────────────────────────────────────────────
  describe("skills", () => {
    it("has at least 3 skill categories", () => {
      expect(resume.skills.length).toBeGreaterThanOrEqual(3);
    });

    it("every category has a name and items", () => {
      resume.skills.forEach((group) => {
        expect(group.category).toBeTruthy();
        expect(group.items.length).toBeGreaterThan(0);
      });
    });

    it("includes Python in programming languages", () => {
      const progGroup = resume.skills.find((g) =>
        g.category.toLowerCase().includes("programming")
      );
      expect(progGroup?.items).toContain("Python");
    });
  });

  // ── education ───────────────────────────────────────────────────────────────
  describe("education", () => {
    it("has at least one entry", () => {
      expect(resume.education.length).toBeGreaterThan(0);
    });

    it("every entry has degree, school, and year", () => {
      resume.education.forEach((edu) => {
        expect(edu.degree).toBeTruthy();
        expect(edu.school).toBeTruthy();
        expect(edu.year).toBeTruthy();
      });
    });
  });

  // ── certifications ──────────────────────────────────────────────────────────
  describe("certifications", () => {
    it("has at least one certification", () => {
      expect(resume.certifications.length).toBeGreaterThan(0);
    });

    it("includes AWS ML Specialty certification", () => {
      const aws = resume.certifications.find((c) =>
        c.name.toLowerCase().includes("aws")
      );
      expect(aws).toBeDefined();
    });
  });

  // ── publications ────────────────────────────────────────────────────────────
  describe("publications", () => {
    it("has at least one publication", () => {
      expect(resume.publications.length).toBeGreaterThan(0);
    });

    it("every publication has a title and year", () => {
      resume.publications.forEach((pub) => {
        expect(pub.title).toBeTruthy();
        expect(pub.year).toBeGreaterThan(2000);
      });
    });

    it("all publication URLs use https", () => {
      resume.publications
        .filter((p) => p.url)
        .forEach((pub) => {
          expect(pub.url).toMatch(/^https:\/\//);
        });
    });
  });
});
