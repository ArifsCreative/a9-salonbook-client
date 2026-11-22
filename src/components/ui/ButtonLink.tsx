
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  showArrow?: boolean;
}

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  showArrow = true,
}: ButtonLinkProps) {
  const styles = {
    primary:
      "bg-[#633B45] text-white border border-[#633B45] hover:bg-[#211F20] hover:border-[#211F20]",
    secondary:
      "bg-[#AA8964] text-white border border-[#AA8964] hover:bg-[#8F7152]",
    outline:
      "bg-transparent text-[#211F20] border border-[#B8AA9A] hover:bg-[#211F20] hover:text-white hover:border-[#211F20]",
  };

  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AA8964] ${styles[variant]} ${className}`}
    >
      {children}
      {showArrow && (
        <ArrowUpRight
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </Link>
  );
}
