import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import Container from "./Container";

const footerLinks = [
  {
    heading: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "Our Services", href: "/services" },
      { label: "About Us", href: "/#about" },
    ],
  },
  {
    heading: "Your Account",
    links: [
      { label: "Sign In", href: "/sign-in" },
      { label: "Create Account", href: "/sign-up" },
      { label: "My Appointments", href: "/customer/appointments" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer id="contact" className="bg-[#211F20] text-[#F6F3ED]">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4 lg:py-20">
          {/* Brand Introduction */}
          <div className="lg:col-span-2">
            <BrandLogo variant="light" />

            <h2 className="mt-9 max-w-md font-serif text-4xl leading-tight text-[#F6F3ED] sm:text-5xl">
              Your beauty.
              <br />
              Your moment.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#BDB2A7]">
              Discover your next beauty experience. Explore treatments, find
              your preferred services and manage your salon appointments with
              SalonBook.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#C3A982] transition hover:text-white"
            >
              Discover Services
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* Footer Navigation */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#C3A982]">
                {group.heading}
              </h3>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#D8CEC1] transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Brand Signature */}
        <div className="flex flex-col justify-between gap-6 border-t border-white/10 py-7 sm:flex-row sm:items-center">
          <p className="text-xs text-[#9F958B]">
            © 2026 SalonBook. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.18em] text-[#AA8964]">
            <span>BEAUTY</span>
            <span>•</span>
            <span>EXPERIENCE</span>
            <span>•</span>
            <span>BOOKING</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
