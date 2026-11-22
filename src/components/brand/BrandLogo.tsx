
import Link from "next/link";

interface BrandLogoProps {
  variant?: "light" | "dark";
  compact?: boolean;
  className?: string;
}

export default function BrandLogo({
  variant = "dark",
  compact = false,
  className = "",
}: BrandLogoProps) {
  const isDark = variant === "dark";

  return (
    <Link
      href="/"
      aria-label="SalonBook home"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border font-serif text-xl tracking-tight transition-colors ${
          isDark
            ? "border-[#AA8964] text-[#AA8964] group-hover:bg-[#AA8964] group-hover:text-[#211F20]"
            : "border-[#AA8964] text-[#AA8964] group-hover:bg-[#AA8964] group-hover:text-white"
        }`}
      >
        S<span className="-ml-1">B</span>
      </span>

      {!compact && (
        <span
          className={`font-sans text-lg font-semibold tracking-[0.16em] ${
            isDark ? "text-[#211F20]" : "text-[#F6F3ED]"
          }`}
        >
          SALONBOOK
        </span>
      )}
    </Link>
  );
}
