"use client";

import { Mail, Linkedin, Download, ChevronDown } from "lucide-react";
import type { ResumeData } from "@/lib/types";

interface Props {
  data: ResumeData;
}

export default function Hero({ data }: Props) {
  const { personal, stats } = data;

  return (
    <section
      id="home"
      aria-label="Introduction"
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">

        {/* Name + Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
          {personal.name}
        </h1>
        <p className="text-xl sm:text-2xl font-semibold gradient-text mb-2">
          {personal.title}
        </p>
        <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mb-10 text-balance">
          {personal.tagline}
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap gap-3 mb-16"
          role="group"
          aria-label="Contact and resume actions"
        >
          <a
            href={`mailto:${personal.email}`}
            className="btn-primary"
            aria-label={`Send email to ${personal.name}`}
          >
            <Mail size={16} aria-hidden="true" />
            Email Me
          </a>

          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="View LinkedIn profile (opens in new tab)"
            >
              <Linkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
          )}


          <a
            href={personal.resumePdf}
            download="Resume_Rutao_Luo.pdf"
            className="btn-secondary"
            aria-label="Download resume PDF"
          >
            <Download size={16} aria-hidden="true" />
            Download Resume
          </a>
        </div>

        {/* Stats strip */}
        {stats && stats.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            aria-label="Career highlights"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce" aria-hidden="true">
        <a href="#experience" tabIndex={-1}>
          <ChevronDown
            size={24}
            className="text-gray-400 dark:text-gray-600"
          />
        </a>
      </div>
    </section>
  );
}
