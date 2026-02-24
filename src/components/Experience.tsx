"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase, ExternalLink } from "lucide-react";
import type { ExperienceEntry } from "@/lib/types";

interface Props {
  experience: ExperienceEntry[];
}

function ExperienceCard({ job, defaultOpen }: { job: ExperienceEntry; defaultOpen: boolean }) {
  const [expanded, setExpanded] = useState(defaultOpen);

  return (
    <div className="relative pl-8">
      {/* Timeline dot */}
      <div
        className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-blue-500 bg-white dark:bg-gray-950 shadow"
        aria-hidden="true"
      />

      <div className="card mb-0">
        {/* Header row */}
        <button
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          aria-controls={`job-${job.id}-details`}
          className="w-full text-left flex items-start justify-between gap-4 group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {job.title}
              </h3>
              {job.current && (
                <span className="tag !bg-green-50 !text-green-700 dark:!bg-green-900/30 dark:!text-green-400 !border-green-100 dark:!border-green-800">
                  Current
                </span>
              )}
              {job.level && (
                <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                  {job.level}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Briefcase size={12} aria-hidden="true" className="shrink-0" />
              {job.companyUrl ? (
                <a
                  href={job.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  {job.company}
                  <ExternalLink size={10} aria-hidden="true" />
                </a>
              ) : (
                <span className="font-medium">{job.company}</span>
              )}
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <span>
                {job.startDate} – {job.endDate}
              </span>
              {job.location && (
                <>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <span>{job.location}</span>
                </>
              )}
            </div>
          </div>
          <span className="shrink-0 mt-0.5 text-gray-400 dark:text-gray-600">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        {/* Expandable details */}
        <div id={`job-${job.id}-details`} hidden={!expanded}>
          {job.summary && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {job.summary}
            </p>
          )}

          {job.bullets && job.bullets.length > 0 && (
            <ul
              className="mt-3 space-y-2"
              aria-label={`Achievements at ${job.company}`}
            >
              {job.bullets.map((bullet, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"
                    aria-hidden="true"
                  />
                  {bullet}
                </li>
              ))}
            </ul>
          )}

          {job.tags && job.tags.length > 0 && (
            <div
              className="mt-4 flex flex-wrap gap-1.5"
              aria-label="Technologies and skills used"
            >
              {job.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Experience({ experience }: Props) {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/20"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">Career Timeline</p>
        <h2 id="experience-heading" className="section-heading">
          Professional Experience
        </h2>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 via-blue-300 to-transparent dark:from-blue-500 dark:via-blue-700"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-6">
            {experience.map((job, i) => (
              <ExperienceCard key={job.id} job={job} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
