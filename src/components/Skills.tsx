import { Brain, Cloud, Database, Code2, Target, type LucideIcon } from "lucide-react";
import type { SkillGroup } from "@/lib/types";

interface Props {
  skills: SkillGroup[];
}

interface CategoryConfig {
  icon: LucideIcon;
  iconColor: string;
  borderColor: string;
  tagClass: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "AI & Data Engineering": {
    icon: Brain,
    iconColor: "text-purple-500",
    borderColor: "border-t-purple-500",
    tagClass:
      "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  },
  "Big Data & Cloud": {
    icon: Cloud,
    iconColor: "text-cyan-500",
    borderColor: "border-t-cyan-500",
    tagClass:
      "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
  },
  "Investment Systems & Data": {
    icon: Database,
    iconColor: "text-amber-500",
    borderColor: "border-t-amber-500",
    tagClass:
      "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  },
  "Programming Languages": {
    icon: Code2,
    iconColor: "text-green-500",
    borderColor: "border-t-green-500",
    tagClass:
      "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
  },
  "Digital Transformation & Architecture": {
    icon: Target,
    iconColor: "text-indigo-500",
    borderColor: "border-t-indigo-500",
    tagClass:
      "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  },
};

const DEFAULT_CONFIG: CategoryConfig = {
  icon: Code2,
  iconColor: "text-blue-500",
  borderColor: "border-t-blue-500",
  tagClass: "",
};

export default function Skills({ skills }: Props) {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="py-20 sm:py-28 bg-[rgb(var(--section-alt))]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">What I work with</p>
        <h2 id="skills-heading" className="section-heading mb-10">
          Technical Skills
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((group, index) => {
            const config = CATEGORY_CONFIG[group.category] ?? DEFAULT_CONFIG;
            const Icon = config.icon;
            return (
              <div
                key={group.category}
                className={`card border-t-2 ${config.borderColor} animate-fade-in`}
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
                role="region"
                aria-labelledby={`skill-cat-${group.category.replace(/\s/g, "-")}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${config.iconColor}`} aria-hidden="true" />
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
                    <span
                      key={item}
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.tagClass || "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
