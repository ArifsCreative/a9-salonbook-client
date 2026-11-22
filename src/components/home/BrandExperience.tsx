import Link from "next/link";
import { ArrowUpRight, CalendarDays, Heart, ShieldCheck } from "lucide-react";
import Container from "@/components/layout/Container";

const benefits = [
  {
    number: "01",
    icon: CalendarDays,
    title: "Effortless Booking",
    description:
      "Discover services and manage your appointments through one convenient platform.",
  },
  {
    number: "02",
    icon: Heart,
    title: "Your Personal Experience",
    description:
      "Explore treatments and choose experiences that match your preferences.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "A Secure Experience",
    description:
      "Manage your account and access your booking and payment information securely.",
  },
];

export function BrandExperience() {
  return (
    <section className="bg-[#211F20] py-24 text-[#F6F3ED] lg:py-32">
      <Container>
        <div className="mb-16 max-w-2xl">
          <p className="sb-label text-[#AA8964]">
            03 / The SalonBook Difference
          </p>
          <h2 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
            Thoughtfully designed
            <span className="italic text-[#C3A982]"> around you.</span>
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.number} className="border-t border-white/20 pt-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-[0.2em] text-[#AA8964]">
                    {item.number}
                  </span>
                  <Icon size={23} className="text-[#AA8964]" />
                </div>

                <h3 className="mt-9 font-serif text-3xl">{item.title}</h3>

                <p className="mt-4 text-sm leading-7 text-[#BDB2A7]">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function BookingCTA() {
  return (
    <section className="bg-[#633B45] py-24 text-white lg:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="sb-label text-[#E3C9A5]">YOUR NEXT CHAPTER</p>

          <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-7xl">
            Make room for
            <br />
            <span className="italic text-[#E3C9A5]">yourself.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#E8D9D5]">
            Discover your next beauty experience and take the first step towards
            your personal moment.
          </p>

          <Link
            href="/services"
            className="mt-9 inline-flex items-center gap-3 bg-[#F6F3ED] px-8 py-4 text-sm font-semibold text-[#211F20] transition hover:bg-[#EAE5DD]"
          >
            Explore Services
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
