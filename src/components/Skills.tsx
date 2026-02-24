import type { SkillGroup } from "@/lib/types";

interface Props {
  skills: SkillGroup[];
}

const CATEGORY_ICONS: Record<string, string> = {
  "AI / Machine Learning": "🤖",
  "Cloud & Infrastructure": "☁️",
  "Big Data": "🔢",
  "Programming Languages": "💻",
  "Leadership & Strategy": "🎯",
};

export default function Skills({ skills }: Props) {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-20 sm:py-28"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">What I work with</p>
        <h2 id="skills-heading" className="section-heading mb-10">
          Technical Skills
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((group) => (
            <div
              key={group.category}
              className="card"
              role="region"
              aria-labelledby={`skill-cat-${group.category.replace(/\s/g, "-")}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl" aria-hidden="true">
                  {CATEGORY_ICONS[group.category] ?? "🔷"}
                </span>
                <h3
                  id={`skill-cat-${group.category.replace(/\s/g, "-")}`}
                  className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide"
                >
                  {group.category}
                </h3>
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                aria-label={`${group.category} skills`}
              >
                {group.items.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
