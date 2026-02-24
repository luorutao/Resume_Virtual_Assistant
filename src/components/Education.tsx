import { GraduationCap, Award } from "lucide-react";
import type { EducationEntry, Certification } from "@/lib/types";

interface Props {
  education: EducationEntry[];
  certifications: Certification[];
}

const CERT_ICONS: Record<string, string> = {
  aws: "☁️",
  sas: "📊",
  actuarial: "📐",
};

export default function Education({ education, certifications }: Props) {
  return (
    <section
      id="education"
      aria-labelledby="education-heading"
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">Academic background</p>
        <h2 id="education-heading" className="section-heading mb-10">
          Education &amp; Certifications
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <GraduationCap
                size={20}
                className="text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Degrees
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="card hover:border-blue-100 dark:hover:border-blue-900 transition-colors"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {edu.degree}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                    {edu.school}
                  </p>
                  {edu.location && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {edu.location}
                    </p>
                  )}
                  {edu.year && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 font-medium">
                      {edu.year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Award
                size={20}
                className="text-blue-600 dark:text-blue-400"
                aria-hidden="true"
              />
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Certifications
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {certifications.map((cert, i) => (
                <div
                  key={i}
                  className="card hover:border-blue-100 dark:hover:border-blue-900 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5" aria-hidden="true">
                      {CERT_ICONS[cert.icon ?? ""] ?? "🏆"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {cert.name}
                      </p>
                      {cert.issuer && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {cert.issuer}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
