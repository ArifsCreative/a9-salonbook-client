
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

export default function BrandIntroduction() {
  return (
    <section id="about" className="bg-[#F6F3ED] py-24 lg:py-32">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">

          <div className="relative">
            <div
              className="aspect-[5/4] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=85')",
              }}
            />

            <div className="absolute -bottom-6 -right-3 bg-[#633B45] px-6 py-5 text-white sm:-right-6">
              <p className="font-serif text-3xl italic">SB.</p>
              <p className="mt-1 text-[9px] tracking-[0.18em]">
                YOUR BEAUTY, YOUR MOMENT.
              </p>
            </div>
          </div>

          <div className="lg:pl-4">
            <SectionHeading
              eyebrow="A Different Perspective"
              title="Beauty is more than a routine."
              description="It is a moment to pause, express yourself and feel confident. SalonBook brings salon discovery and appointment booking together in one thoughtful experience."
            />

            <div className="mt-9 grid grid-cols-2 gap-6 border-t border-[#D8CEC1] pt-7">
              <div>
                <p className="font-serif text-2xl text-[#633B45]">
                  Discover
                </p>
                <p className="mt-2 text-xs leading-6 text-[#746B62]">
                  Find services that match your personal style.
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl text-[#633B45]">
                  Experience
                </p>
                <p className="mt-2 text-xs leading-6 text-[#746B62]">
                  Manage your salon appointments with ease.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
