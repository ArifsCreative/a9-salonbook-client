
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    number: "01",
    name: "Hair & Styling",
    description: "Express your individual style.",
    image:
      "https://images.unsplash.com/photo-1560869713-da86a9ecb2d6?auto=format&fit=crop&w=800&q=85",
    category: "Hair & Styling",
  },
  {
    number: "02",
    name: "Skin & Facial",
    description: "A little care goes a long way.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=85",
    category: "Skin & Facial",
  },
  {
    number: "03",
    name: "Nails & Beauty",
    description: "Details that make a difference.",
    image:
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=85",
    category: "Nails & Beauty",
  },
];

export default function ServiceCategories() {
  return (
    <section className="bg-[#EAE5DD] py-24 lg:py-32">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="01 / Explore"
            title="Find your signature experience."
            description="Explore a curated range of beauty and salon categories."
          />

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#633B45] hover:text-[#211F20]"
          >
            All Services <ArrowUpRight size={17} />
          </Link>
        </div>

        <div className="grid gap-7 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.number}
              href={`/services?category=${encodeURIComponent(category.category)}`}
              className="group"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#D8CEC1]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url('${category.image}')`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#211F20]/75 via-transparent to-transparent" />

                <span className="absolute left-6 top-6 text-xs tracking-[0.2em] text-white">
                  {category.number} / 03
                </span>

                <div className="absolute bottom-7 left-7 right-7">
                  <p className="text-xs text-[#E3C9A5]">
                    {category.description}
                  </p>

                  <div className="mt-2 flex items-center justify-between">
                    <h3 className="font-serif text-3xl text-white sm:text-4xl">
                      {category.name}
                    </h3>

                    <ArrowUpRight
                      className="text-white transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      size={22}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
