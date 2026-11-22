import HomeHero from "@/components/home/HomeHero";
import BrandIntroduction from "@/components/home/BrandIntroduction";
import ServiceCategories from "@/components/home/ServiceCategories";
import FeaturedServices from "@/components/home/FeaturedServices";
import { BrandExperience, BookingCTA } from "@/components/home/BrandExperience";

export default function Home() {
  return (
    <main>
      <HomeHero />

      <BrandIntroduction />

      <ServiceCategories />

      <FeaturedServices />

      <BrandExperience />

      <BookingCTA />
    </main>
  );
}
