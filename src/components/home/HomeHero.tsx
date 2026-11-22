
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-[#211F20] text-[#F6F3ED]">
      <Container>
        <div className="grid min-h-[650px] items-center gap-10 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">

          {/* Editorial Copy */}
          <div className="relative z-10">
            <div className="mb-8 flex items-center gap-3">
              <span className="h-px w-10 bg-[#AA8964]" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C3A982]">
                The Art of Self-Care
              </span>
            </div>

            <h1 className="max-w-xl font-serif text-6xl font-normal leading-[1.02] tracking-tight sm:text-7xl lg:text-[88px]">
              Beauty deserves
              <br />
              <span className="italic text-[#C3A982]">
                your own
              </span>
              <br />
              moment.
            </h1>

            <p className="mt-8 max-w-md text-sm leading-8 text-[#D8CEC1] sm:text-base">
              Discover exceptional beauty treatments, explore
              signature services and make time for the experience
              you deserve.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link
                href="/services"
                className="inline-flex min-h-13 items-center gap-3 bg-[#AA8964] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#8F7152]"
              >
                Explore Services
                <ArrowUpRight size={18} />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-sm font-medium text-[#EAE5DD] transition hover:text-[#C3A982]"
              >
                Join SalonBook
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div className="mt-16 flex items-center gap-5 border-t border-white/15 pt-7">
              <Sparkles size={19} className="text-[#AA8964]" />
              <p className="max-w-xs text-xs leading-6 text-[#BDB2A7]">
                A more thoughtful way to discover and book your
                beauty experiences.
              </p>
            </div>
          </div>

          {/* Editorial Photography */}
          <div className="relative mx-auto w-full max-w-[650px]">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#633B45]">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 hover:scale-105"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85')",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#211F20]/65 via-transparent to-transparent" />

              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E3C9A5]">
                  SALONBOOK / EXPERIENCE
                </p>
                <p className="mt-3 max-w-sm font-serif text-3xl leading-tight text-white sm:text-4xl">
                  A moment that belongs entirely to you.
                </p>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-5 hidden border border-[#AA8964] bg-[#211F20] px-5 py-4 sm:block">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#AA8964]">
                DISCOVER
              </p>
              <p className="mt-1 font-serif text-xl text-[#F6F3ED]">
                Your beauty ritual.
              </p>
            </div>

            <div className="absolute -right-3 top-10 hidden h-20 w-20 items-center justify-center rounded-full border border-[#AA8964]/60 bg-[#211F20] sm:flex">
              <span className="font-serif text-2xl text-[#C3A982]">
                SB.
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
