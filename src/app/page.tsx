import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Publications from "@/components/Publications";
import BeyondWork from "@/components/BeyondWork";
import Contact from "@/components/Contact";
import resumeData from "@/data/resume.json";
import type { ResumeData } from "@/lib/types";

const data = resumeData as unknown as ResumeData;

export default function Home() {
  return (
    <>
      <Hero data={data} />
      <Experience experience={data.experience} />
      <Skills skills={data.skills} />
      <Education
        education={data.education}
        certifications={data.certifications}
      />
      <Publications publications={data.publications} />
      {data.beyondWork && <BeyondWork beyondWork={data.beyondWork} />}
      <Contact personal={data.personal} />
    </>
  );
}
