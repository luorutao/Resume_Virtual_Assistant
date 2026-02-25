import type { BeyondWork as BeyondWorkType } from "@/lib/types";

interface Props {
  beyondWork: BeyondWorkType;
}

export default function BeyondWork({ beyondWork }: Props) {
  return (
    <section
      id="beyond"
      aria-labelledby="beyond-heading"
      className="py-20 sm:py-28 bg-gray-50/50 dark:bg-gray-900/20"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">Outside the office</p>
        <h2 id="beyond-heading" className="section-heading mb-10">
          Beyond Work
        </h2>

        <div className="flex flex-col gap-5">
          {beyondWork.paragraphs.map((para, i) => (
            <p
              key={i}
              className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
