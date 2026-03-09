interface Props {
  paragraphs: string[];
}

export default function About({ paragraphs }: Props) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-20 sm:py-28"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <p className="section-subheading">Background</p>
        <h2 id="about-heading" className="section-heading mb-10">
          About Me
        </h2>
        <div className="flex flex-col gap-5">
          {paragraphs.map((para, i) => (
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
