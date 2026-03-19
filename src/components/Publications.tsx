import { BookOpen, ExternalLink, Quote, TrendingUp, BarChart2 } from "lucide-react";
import type { Publication, ScholarMetrics } from "@/lib/types";

interface Props {
  publications: Publication[];
  scholarMetrics?: ScholarMetrics;
}

export default function Publications({ publications, scholarMetrics }: Props) {
  if (!publications || publications.length === 0) return null;

  return (
    <section
      id="publications"
      aria-labelledby="publications-heading"
      className="py-20 sm:py-28"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">Academic contributions</p>
        <h2 id="publications-heading" className="section-heading mb-2">
          Selected Publications
        </h2>
        {scholarMetrics ? (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              {
                label: "Citations",
                all: scholarMetrics.citations,
                recent: scholarMetrics.citationsSince2021,
                icon: Quote,
                iconColor: "text-blue-500",
                iconBg: "bg-blue-50 dark:bg-blue-900/30",
              },
              {
                label: "h-index",
                all: scholarMetrics.hIndex,
                recent: scholarMetrics.hIndexSince2021,
                icon: TrendingUp,
                iconColor: "text-purple-500",
                iconBg: "bg-purple-50 dark:bg-purple-900/30",
              },
              {
                label: "i10-index",
                all: scholarMetrics.i10Index,
                recent: scholarMetrics.i10IndexSince2021,
                icon: BarChart2,
                iconColor: "text-amber-500",
                iconBg: "bg-amber-50 dark:bg-amber-900/30",
              },
            ].map(({ label, all, recent, icon: Icon, iconColor, iconBg }) => (
              <div key={label} className="card text-center p-5">
                <div
                  className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center mx-auto mb-3`}
                >
                  <Icon className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{all}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-0.5">
                  {label}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {recent} since 2021
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
            ~300 citations across peer-reviewed journals and conference papers.
          </p>
        )}

        <div className="flex flex-col gap-4">
          {publications.map((pub, i) => (
            <div
              key={i}
              className="card flex items-start gap-4 hover:border-blue-100 dark:hover:border-blue-900 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: "both" }}
            >
              <div className="shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <BookOpen
                    size={14}
                    className="text-blue-600 dark:text-blue-400"
                    aria-hidden="true"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">
                  {pub.url ? (
                    <a
                      href={pub.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-start gap-1 group"
                      aria-label={`${pub.title} (opens in new tab)`}
                    >
                      {pub.title}
                      <ExternalLink
                        size={11}
                        className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    pub.title
                  )}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {pub.journal && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                      {pub.journal}
                    </span>
                  )}
                  {pub.authors && (
                    <span className="text-xs text-gray-400 dark:text-gray-600 truncate max-w-xs">
                      {pub.authors}
                    </span>
                  )}
                  {pub.year && (
                    <span className="tag !text-xs">{pub.year}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
