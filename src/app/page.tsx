import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Publications from "@/components/Publications";
import Contact from "@/components/Contact";
import resumeData from "@/data/resume.json";

export default function Home() {
  return (
    <>
      <Hero data={resumeData} />
      <Experience experience={resumeData.experience} />
      <Skills skills={resumeData.skills} />
      <Education
        education={resumeData.education}
        certifications={resumeData.certifications}
      />
      <Publications publications={resumeData.publications} />
      <Contact personal={resumeData.personal} />
    </>
  );
}
