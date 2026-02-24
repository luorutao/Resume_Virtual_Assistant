import { Mail, Linkedin, Github, Download, Phone } from "lucide-react";
import type { PersonalInfo } from "@/lib/types";

interface Props {
  personal: PersonalInfo;
}

export default function Contact({ personal }: Props) {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="section-subheading">Get in touch</p>
        <h2 id="contact-heading" className="section-heading">
          Let&apos;s Connect
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto text-balance">
          Whether you&apos;re looking to collaborate on AI/ML projects, discuss
          financial technology, or just say hello — I&apos;d love to hear from
          you.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          {/* Email */}
          <a
            href={`mailto:${personal.email}`}
            className="btn-primary"
            aria-label={`Email ${personal.name} at ${personal.email}`}
          >
            <Mail size={16} aria-hidden="true" />
            {personal.email}
          </a>

          {/* Phone (optional) */}
          {personal.phone && (
            <a
              href={`tel:${personal.phone.replace(/\D/g, "")}`}
              className="btn-secondary"
              aria-label={`Call ${personal.name}`}
            >
              <Phone size={16} aria-hidden="true" />
              {personal.phone}
            </a>
          )}

          {/* LinkedIn */}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="Connect on LinkedIn (opens in new tab)"
            >
              <Linkedin size={16} aria-hidden="true" />
              LinkedIn
            </a>
          )}

          {/* GitHub */}
          {personal.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              aria-label="View GitHub profile (opens in new tab)"
            >
              <Github size={16} aria-hidden="true" />
              GitHub
            </a>
          )}

          {/* Download Resume */}
          <a
            href={personal.resumePdf}
            download="Resume_Rutao_Luo.pdf"
            className="btn-secondary"
            aria-label="Download resume as PDF"
          >
            <Download size={16} aria-hidden="true" />
            Download Resume
          </a>
        </div>
      </div>
    </section>
  );
}
