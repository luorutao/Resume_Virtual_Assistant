#!/usr/bin/env node
/**
 * generate-resume.js
 * Reads resume_sources/Resume_Rutao_Luo.pdf (or resume.md fallback)
 * and writes src/data/resume.json
 *
 * Usage: npm run generate:resume
 */

const path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PDF_PATH = path.join(ROOT, "resume_sources", "Resume_Rutao_Luo.pdf");
const MD_PATH = path.join(ROOT, "resume.md");
const OUTPUT_PATH = path.join(ROOT, "src", "data", "resume.json");

// ─── helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[generate-resume] ${msg}`);
}

function err(msg) {
  console.error(`[generate-resume] ERROR: ${msg}`);
}

// ─── Step 1: extract text ─────────────────────────────────────────────────────

function extractTextFromPdf(pdfPath) {
  log(`Extracting text from ${pdfPath} …`);
  const script = `
import pdfplumber, sys, json
with pdfplumber.open(sys.argv[1]) as pdf:
    pages = [p.extract_text() or "" for p in pdf.pages]
print("\\n".join(pages))
`;
  const tmpScript = path.join(ROOT, "scripts", "_tmp_extract.py");
  fs.writeFileSync(tmpScript, script);
  try {
    const text = execSync(`uv run --with pdfplumber python3 "${tmpScript}" "${pdfPath}"`, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    fs.unlinkSync(tmpScript);
    return text;
  } catch (e) {
    if (fs.existsSync(tmpScript)) fs.unlinkSync(tmpScript);
    throw new Error(`PDF extraction failed: ${e.message}\nFix: ensure uv is installed (brew install uv)`);
  }
}

function extractTextFromMd(mdPath) {
  log(`Falling back to ${mdPath} …`);
  return fs.readFileSync(mdPath, "utf-8");
}

// ─── Step 2: naive text → resume.json parser ──────────────────────────────────

function parseResumeText(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const resume = {
    meta: { generatedAt: new Date().toISOString(), source: "" },
    personal: {},
    summary: [],
    experience: [],
    skills: [],
    education: [],
    certifications: [],
    publications: [],
  };

  let section = "";
  let currentJob = null;
  let currentEdu = null;

  const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/;
  const PHONE_RE = /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
  const DATE_RE = /(?:January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}/i;
  const PRESENT_RE = /Present|Current|Now/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // section headings
    if (/^SUMMARY/i.test(line)) { section = "summary"; continue; }
    if (/^TECHNICAL SKILLS/i.test(line)) { section = "skills"; continue; }
    if (/^PROFESSIONAL EXPERIENCE/i.test(line)) { section = "experience"; continue; }
    if (/^CERTIFICATES?\/EXAMS?|^CERTIFICATIONS?/i.test(line)) { section = "certs"; continue; }
    if (/^EDUCATION/i.test(line)) { section = "education"; continue; }
    if (/^PUBLICATIONS?/i.test(line)) { section = "publications"; continue; }

    // personal info (first lines before any section)
    if (!section) {
      if (!resume.personal.name && /[A-Z][a-z]+ [A-Z][a-z]+/.test(line)) {
        resume.personal.name = line;
      } else if (!resume.personal.title && resume.personal.name) {
        resume.personal.title = line;
      } else if (EMAIL_RE.test(line)) {
        resume.personal.email = line.match(EMAIL_RE)[0];
      } else if (PHONE_RE.test(line)) {
        resume.personal.phone = line.match(PHONE_RE)[0];
      }
      continue;
    }

    if (section === "summary") {
      if (/^[▪•\-*]/.test(line)) {
        const clean = line.replace(/^[▪•\-*]\s*/, "");
        const colonIdx = clean.indexOf(":");
        if (colonIdx > 0) {
          resume.summary.push({ label: clean.slice(0, colonIdx).trim(), text: clean.slice(colonIdx + 1).trim() });
        } else {
          resume.summary.push({ label: "", text: clean });
        }
      }
    }

    if (section === "skills") {
      const colonIdx = line.indexOf(":");
      if (colonIdx > 0) {
        const category = line.slice(0, colonIdx).trim();
        const items = line.slice(colonIdx + 1).split(",").map((s) => s.trim()).filter(Boolean);
        resume.skills.push({ category, items });
      }
    }

    if (section === "experience") {
      // detect job title line: "Title Company | Month Year - Month Year"
      const pipeIdx = line.indexOf("|");
      if (pipeIdx > 0) {
        const beforePipe = line.slice(0, pipeIdx).trim();
        const afterPipe = line.slice(pipeIdx + 1).trim();
        const dateMatch = afterPipe.match(new RegExp(`(${DATE_RE.source})\\s*[-–]\\s*(${DATE_RE.source}|${PRESENT_RE.source})`, "i"));
        if (dateMatch) {
          if (currentJob) resume.experience.push(currentJob);
          // split company from title: last word(s) might be company
          currentJob = {
            id: `job-${resume.experience.length}`,
            title: beforePipe,
            company: "",
            startDate: dateMatch[1],
            endDate: dateMatch[2],
            current: PRESENT_RE.test(dateMatch[2]),
            summary: "",
            bullets: [],
            tags: [],
          };
          continue;
        }
      }
      if (currentJob) {
        if (/^[●•▪\-*]/.test(line)) {
          currentJob.bullets.push(line.replace(/^[●•▪\-*]\s*/, ""));
        } else if (!currentJob.summary) {
          currentJob.summary = line;
        }
      }
    }

    if (section === "certs") {
      if (/^[●•▪\-*]/.test(line)) {
        const name = line.replace(/^[●•▪\-*]\s*/, "");
        resume.certifications.push({ name, issuer: "", icon: "" });
      }
    }

    if (section === "education") {
      // pattern: "Degree University | Month Year"
      if (/University|College|Institute/i.test(line)) {
        const pipeIdx = line.indexOf("|");
        const year = pipeIdx > 0 ? line.slice(pipeIdx + 1).trim() : "";
        const rest = pipeIdx > 0 ? line.slice(0, pipeIdx).trim() : line;
        // split: first part is degree, then school
        const parts = rest.split(/\s{2,}/);
        if (parts.length >= 2) {
          resume.education.push({ degree: parts[0], school: parts.slice(1).join(" "), year });
        } else {
          resume.education.push({ degree: "", school: rest, year });
        }
      }
    }

    if (section === "publications") {
      if (line.length > 20 && !/^http/.test(line)) {
        const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
        resume.publications.push({
          title: line.replace(/\.\s*$/, ""),
          year: yearMatch ? parseInt(yearMatch[1], 10) : null,
          url: "",
        });
      }
    }
  }

  // flush last job
  if (currentJob) resume.experience.push(currentJob);

  return resume;
}

// ─── main ──────────────────────────────────────────────────────────────────────

async function main() {
  let rawText = "";
  let source = "";

  if (fs.existsSync(PDF_PATH)) {
    try {
      rawText = extractTextFromPdf(PDF_PATH);
      source = PDF_PATH;
    } catch (e) {
      err(e.message);
      if (fs.existsSync(MD_PATH)) {
        rawText = extractTextFromMd(MD_PATH);
        source = MD_PATH;
      } else {
        err(`No fallback resume.md found either. Create one at ${MD_PATH}`);
        process.exit(1);
      }
    }
  } else if (fs.existsSync(MD_PATH)) {
    rawText = extractTextFromMd(MD_PATH);
    source = MD_PATH;
  } else {
    err(`Cannot find PDF at ${PDF_PATH} or Markdown at ${MD_PATH}`);
    err(`Copy your resume to one of those locations and re-run: npm run generate:resume`);
    process.exit(1);
  }

  const parsed = parseResumeText(rawText);
  parsed.meta.source = path.relative(ROOT, source);

  // preserve existing personal fields not found by parser (like linkedin, github)
  let existing = {};
  if (fs.existsSync(OUTPUT_PATH)) {
    try {
      existing = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    } catch (_) {}
  }
  if (existing.personal) {
    parsed.personal = { ...existing.personal, ...parsed.personal };
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(parsed, null, 2));
  log(`✓ Written to ${path.relative(ROOT, OUTPUT_PATH)}`);
  log(`  ${parsed.experience.length} experience entries`);
  log(`  ${parsed.skills.length} skill categories`);
  log(`  ${parsed.education.length} education entries`);
  log(`  ${parsed.certifications.length} certifications`);
  log(`  ${parsed.publications.length} publications`);
}

main().catch((e) => { err(e.message); process.exit(1); });
