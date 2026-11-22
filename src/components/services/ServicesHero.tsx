import Container from "@/components/layout/Container";

export default function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-[#211F20] py-20 text-[#F6F3ED] lg:py-28">
      <Container>
        <div className="max-w-3xl">
          <div className="mb-7 flex items-center gap-3">
            <span className="h-px w-10 bg-[#AA8964]" />
            <span className="sb-label text-[#C3A982]">
              THE SALONBOOK COLLECTION
            </span>
          </div>

          <h1 className="font-serif text-6xl leading-[1.05] sm:text-7xl lg:text-8xl">
            Discover your
            <br />
            <span className="italic text-[#C3A982]">beauty ritual.</span>
          </h1>

          <p className="mt-7 max-w-lg text-sm leading-8 text-[#D8CEC1] sm:text-base">
            Explore our collection of salon and beauty services. Find the
            experience that feels right for you.
          </p>

          <div className="mt-10 flex items-center gap-4 text-xs tracking-widest text-[#AA8964]">
            <span>DISCOVER</span>
            <span>—</span>
            <span>EXPLORE</span>
            <span>—</span>
            <span>EXPERIENCE</span>
          </div>
        </div>
      </Container>

      <div className="pointer-events-none absolute -bottom-24 -right-20 hidden h-80 w-80 rounded-full border border-[#AA8964]/20 lg:block" />
      <div className="pointer-events-none absolute -bottom-16 -right-12 hidden h-64 w-64 rounded-full border border-[#AA8964]/20 lg:block" />
    </section>
  );
}
