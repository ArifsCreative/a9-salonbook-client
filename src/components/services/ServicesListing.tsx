"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Clock,
  RefreshCw,
} from "lucide-react";

import Container from "@/components/layout/Container";

interface Service {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
}

type SortOption = "default" | "low-high" | "high-low";

export default function ServicesListing() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Services");
  const [sort, setSort] = useState<SortOption>("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data without changing React state
  const requestServices = useCallback(async (): Promise<Service[]> => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API URL is not configured.");
    }

    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/services`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Unable to load salon services.");
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.services)) {
      throw new Error("Invalid services response from server.");
    }

    return data.services.filter(
      (service: Service) => service.status === "active",
    );
  }, []);

  // Initial data loading
  useEffect(() => {
    let cancelled = false;

    requestServices()
      .then((data) => {
        if (!cancelled) {
          setServices(data);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestServices]);

  // Retry button handler
  const fetchServices = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await requestServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    return [
      "All Services",
      ...Array.from(
        new Set(services.map((service) => service.category)),
      ).sort(),
    ];
  }, [services]);

  const filteredServices = useMemo(() => {
    let result = [...services];

    if (category !== "All Services") {
      result = result.filter((service) => service.category === category);
    }

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (service) =>
          service.serviceName.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.category.toLowerCase().includes(query),
      );
    }

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, category, search, sort]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  return (
    <section className="bg-[#F6F3ED] py-16 lg:py-24">
      <Container>
        {/* Section Introduction */}
        <div className="mb-12">
          <p className="sb-label text-[#633B45]">THE COLLECTION / 01</p>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-4xl text-[#211F20] sm:text-5xl">
                Explore our services.
              </h2>

              <p className="mt-3 text-sm text-[#746B62]">
                Find something that makes you feel extraordinary.
              </p>
            </div>

            <p className="text-sm text-[#633B45]">
              {loading
                ? "Loading collection..."
                : `${filteredServices.length} services available`}
            </p>
          </div>
        </div>

        {/* Search and Sorting */}
        <div className="grid gap-4 border-y border-[#D8CEC1] py-6 md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AA8964]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services, treatments or categories..."
              className="h-13 w-full border border-[#D8CEC1] bg-white pl-12 pr-4 text-sm text-[#211F20] outline-none transition placeholder:text-[#9B9187] focus:border-[#AA8964]"
            />
          </div>

          <div className="relative">
            <SlidersHorizontal
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AA8964]"
            />

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="h-13 w-full appearance-none border border-[#D8CEC1] bg-white pl-11 pr-4 text-sm text-[#211F20] outline-none focus:border-[#AA8964]"
            >
              <option value="default">Default sorting</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 overflow-x-auto py-7">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 border px-5 py-3 text-xs font-semibold transition ${
                category === item
                  ? "border-[#633B45] bg-[#633B45] text-white"
                  : "border-[#D8CEC1] bg-transparent text-[#746B62] hover:border-[#633B45] hover:text-[#633B45]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="animate-pulse">
                <div className="aspect-[4/4.5] bg-[#EAE5DD]" />
                <div className="mt-5 h-5 w-2/3 bg-[#EAE5DD]" />
                <div className="mt-3 h-4 w-full bg-[#EAE5DD]" />
                <div className="mt-3 h-4 w-1/3 bg-[#EAE5DD]" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="border border-[#D8CEC1] bg-white px-6 py-16 text-center">
            <h3 className="font-serif text-3xl text-[#211F20]">
              Unable to load the collection.
            </h3>

            <p className="mt-3 text-sm text-[#746B62]">{error}</p>

            <button
              type="button"
              onClick={() => void fetchServices()}
              className="mt-7 inline-flex items-center gap-2 bg-[#633B45] px-6 py-3 text-sm font-semibold text-white hover:bg-[#211F20]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredServices.length === 0 && (
          <div className="border border-[#D8CEC1] bg-white px-6 py-20 text-center">
            <Search size={28} className="mx-auto text-[#AA8964]" />

            <h3 className="mt-5 font-serif text-3xl text-[#211F20]">
              Nothing found just yet.
            </h3>

            <p className="mt-3 text-sm text-[#746B62]">
              Try another search or select a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Services");
                setSort("default");
              }}
              className="mt-6 text-sm font-semibold text-[#633B45] underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && filteredServices.length > 0 && (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
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
                      <div className="absolute inset-0 flex items-center justify-center font-serif text-3xl text-[#AA8964]">
                        SB.
                      </div>
                    )}

                    <span className="absolute left-5 top-5 bg-[#F6F3ED] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#633B45]">
                      {service.category}
                    </span>

                    <span className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F3ED] text-[#633B45] transition group-hover:bg-[#633B45] group-hover:text-white">
                      <ArrowUpRight size={19} />
                    </span>
                  </div>

                  <div className="border-b border-[#D8CEC1] py-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-serif text-2xl text-[#211F20] transition group-hover:text-[#633B45]">
                        {service.serviceName}
                      </h3>
                    </div>

                    <p className="mt-3 line-clamp-2 min-h-10 text-xs leading-6 text-[#746B62]">
                      {service.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-lg font-semibold text-[#633B45]">
                        {formatPrice(service.price)}
                      </span>

                      <span className="flex items-center gap-1.5 text-xs text-[#746B62]">
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
