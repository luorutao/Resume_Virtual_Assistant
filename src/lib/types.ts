export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  location?: string;
  email: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  resumePdf: string;
}

export interface SummaryItem {
  label: string;
  text: string;
}

export interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  companyUrl?: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  level?: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  location?: string;
  year: string;
}

export interface Certification {
  name: string;
  issuer?: string;
  icon?: string;
}

export interface Publication {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  url?: string;
}

export interface Stat {
  label: string;
  value: string;
}

export interface ResumeData {
  meta: { generatedAt: string; source: string };
  personal: PersonalInfo;
  summary: SummaryItem[];
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  education: EducationEntry[];
  certifications: Certification[];
  publications: Publication[];
  stats?: Stat[];
}
