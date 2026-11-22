"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import Container from "@/components/layout/Container";
import SectionHeading from "@/components/ui/SectionHeading";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: string;
}

export default function FeaturedServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/api/services`, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to retrieve salon services.");
        }

        const data = await response.json();

        const activeServices = Array.isArray(data.services)
          ? data.services.filter(
              (service: Service) => service.status === "active",
            )
          : [];

        setServices(activeServices.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <section className="bg-[#F6F3ED] py-24 lg:py-32">
      <Container>
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="02 / The Collection"
            title="A service for every version of you."
            description="Explore our available salon treatments and discover your next experience."
          />

          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#633B45]"
          >
            Explore all <ArrowUpRight size={17} />
          </Link>
        </div>

        {loading && (
          <div className="grid gap-7 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse bg-[#EAE5DD]"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="border border-[#D8CEC1] bg-white p-8 text-center">
            <p className="text-sm text-[#746B62]">{error}</p>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <div className="border border-[#D8CEC1] bg-white px-6 py-14 text-center">
            <h3 className="font-serif text-3xl text-[#211F20]">
              The collection is being prepared.
            </h3>
            <p className="mt-3 text-sm text-[#746B62]">
              Available salon services will appear here.
            </p>
          </div>
        )}

        {!loading && !error && services.length > 0 && (
          <div className="grid gap-7 md:grid-cols-3">
            {services.map((service) => (
              <article key={service._id} className="group">
                <Link href={`/services/${service._id}`}>
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-[#EAE5DD]">
                    {service.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url("${service.image}")`,
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl text-[#AA8964]">
                        SALONBOOK
                      </div>
                    )}

                    <span className="absolute left-4 top-4 bg-[#F6F3ED] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#633B45]">
                      {service.category}
                    </span>
                  </div>

                  <div className="border-b border-[#D8CEC1] py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-2xl text-[#211F20]">
                          {service.serviceName}
                        </h3>

                        <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#746B62]">
                          {service.description}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={19}
                        className="shrink-0 text-[#AA8964]"
                      />
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-lg font-semibold text-[#633B45]">
                        ${service.price}
                      </p>

                      <span className="flex items-center gap-1 text-xs text-[#746B62]">
                        <Clock size={14} />
                        {service.duration} min
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
