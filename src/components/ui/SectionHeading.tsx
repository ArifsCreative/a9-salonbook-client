
interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : "text-left"
      }`}
    >
      <p
        className={`mb-4 text-xs font-semibold uppercase tracking-[0.22em] ${
          light ? "text-[#C3A982]" : "text-[#633B45]"
        }`}
      >
        {eyebrow}
      </p>

      <h2
        className={`font-serif text-4xl font-normal leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl ${
          light ? "text-[#F6F3ED]" : "text-[#211F20]"
        }`}
      >
        {title}
      </h2>

      {description && (
        <p
          className={`mt-5 max-w-2xl text-sm leading-7 sm:text-base ${
            light ? "text-[#D8CEC1]" : "text-[#746B62]"
          } ${align === "center" ? "mx-auto" : ""}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}
