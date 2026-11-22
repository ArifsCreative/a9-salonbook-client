import type { Metadata } from "next";

import ServicesHero from "@/components/services/ServicesHero";
import ServicesListing from "@/components/services/ServicesListing";

export const metadata: Metadata = {
  title: "Explore Services",
  description: "Discover salon treatments and beauty services with SalonBook.",
};

export default function ServicesPage() {
  return (
    <main>
      <ServicesHero />
      <ServicesListing />
    </main>
  );
}
