"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  Sparkles,
  LoaderCircle,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";
import Container from "@/components/layout/Container";

interface CustomerStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
}

const initialStats: CustomerStats = {
  totalAppointments: 0,
  pendingAppointments: 0,
  confirmedAppointments: 0,
  cancelledAppointments: 0,
};

export default function CustomerDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<CustomerStats>(initialStats);
  const [customerName, setCustomerName] = useState("Customer");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      throw new Error("API URL is not configured.");
    }

    const baseUrl = apiUrl.replace(/\/$/, "");

    // Retrieve authenticated JWT
    const tokenResponse = await fetch(`${baseUrl}/api/auth/token`, {
      credentials: "include",
    });

    if (!tokenResponse.ok) {
      throw new Error(
        "Your session could not be verified. Please sign in again.",
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.token) {
      throw new Error("Authentication token is unavailable.");
    }

    const headers = {
      Authorization: `Bearer ${tokenData.token}`,
    };

    // Verify the actual customer profile
    const profileResponse = await fetch(`${baseUrl}/api/profile/me`, {
      headers,
    });

    const profileData = await profileResponse.json();

    if (!profileResponse.ok || !profileData.success || !profileData.profile) {
      throw new Error(
        profileData.message || "Unable to retrieve your profile.",
      );
    }

    if (profileData.profile.role !== "customer") {
      throw new Error("This dashboard is only available to customers.");
    }

    setCustomerName(profileData.profile.name || "Customer");

    // Retrieve customer dashboard statistics
    const dashboardResponse = await fetch(`${baseUrl}/api/dashboard/customer`, {
      headers,
    });

    const dashboardData = await dashboardResponse.json();

    if (!dashboardResponse.ok || !dashboardData.success) {
      throw new Error(
        dashboardData.message || "Unable to load dashboard statistics.",
      );
    }

    setStats({
      ...initialStats,
      ...dashboardData.stats,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const baseUrl = apiUrl.replace(/\/$/, "");

        const tokenResponse = await fetch(`${baseUrl}/api/auth/token`, {
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          throw new Error(
            "Your session could not be verified. Please sign in again.",
          );
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.token) {
          throw new Error("Authentication token is unavailable.");
        }

        const headers = {
          Authorization: `Bearer ${tokenData.token}`,
        };

        const profileResponse = await fetch(`${baseUrl}/api/profile/me`, {
          headers,
        });

        const profileData = await profileResponse.json();

        if (
          !profileResponse.ok ||
          !profileData.success ||
          !profileData.profile
        ) {
          throw new Error(
            profileData.message || "Unable to retrieve your profile.",
          );
        }

        if (profileData.profile.role !== "customer") {
          throw new Error("This dashboard is only available to customers.");
        }

        const dashboardResponse = await fetch(
          `${baseUrl}/api/dashboard/customer`,
          { headers },
        );

        const dashboardData = await dashboardResponse.json();

        if (!dashboardResponse.ok || !dashboardData.success) {
          throw new Error(
            dashboardData.message || "Unable to load dashboard statistics.",
          );
        }

        if (!cancelled) {
          setCustomerName(profileData.profile.name || "Customer");
          setStats({
            ...initialStats,
            ...dashboardData.stats,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Something went wrong.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
    router.refresh();
  };

  const statCards = [
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
    },
    {
      label: "Pending",
      value: stats.pendingAppointments,
      icon: Clock3,
    },
    {
      label: "Confirmed",
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
    },
    {
      label: "Cancelled",
      value: stats.cancelledAppointments,
      icon: XCircle,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F6F3ED]">
      <section className="border-b border-[#D8CEC1] bg-[#211F20] py-12 text-white sm:py-16">
        <Container>
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="sb-label text-[#C3A982]">YOUR PERSONAL SPACE</p>

              <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
                Welcome back,
                <br />
                <span className="italic text-[#C3A982]">{customerName}.</span>
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#D8CEC1]">
                Your appointments and beauty experiences, all in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-[#C3A982] px-5 py-3 text-xs font-semibold text-[#211F20] transition hover:bg-white"
              >
                Explore Services
                <ArrowUpRight size={16} />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 border border-white/25 px-5 py-3 text-xs text-white transition hover:bg-white/10"
              >
                <LogOut size={15} />
                Sign Out
              </button>
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <section className="py-12 sm:py-16">
          <div className="mb-9">
            <p className="sb-label text-[#633B45]">YOUR OVERVIEW / 01</p>

            <h2 className="mt-3 font-serif text-4xl text-[#211F20]">
              Appointment overview.
            </h2>

            <p className="mt-3 text-sm text-[#746B62]">
              A quick look at your SalonBook activity.
            </p>
          </div>

          {loading ? (
            <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-[#746B62]">
              <LoaderCircle size={20} className="animate-spin" />
              Loading your dashboard...
            </div>
          ) : error ? (
            <div className="border border-[#D8CEC1] bg-white px-6 py-12 text-center">
              <h3 className="font-serif text-2xl text-[#211F20]">
                Unable to load your dashboard.
              </h3>

              <p className="mt-3 text-sm text-[#746B62]">{error}</p>

              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError("");

                  void loadDashboard()
                    .catch((err: unknown) => {
                      setError(
                        err instanceof Error
                          ? err.message
                          : "Something went wrong.",
                      );
                    })
                    .finally(() => setLoading(false));
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#633B45] px-5 py-3 text-xs font-semibold text-white hover:bg-[#211F20]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.label}
                    className="border border-[#D8CEC1] bg-white p-6 transition hover:border-[#AA8964]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#746B62]">
                        {card.label}
                      </span>

                      <Icon size={19} className="text-[#AA8964]" />
                    </div>

                    <p className="mt-6 font-serif text-5xl text-[#211F20]">
                      {card.value}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mb-16 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="bg-[#EAE5DD] p-8 sm:p-10">
            <Sparkles size={23} className="text-[#AA8964]" />

            <p className="mt-5 sb-label text-[#633B45]">YOUR NEXT EXPERIENCE</p>

            <h2 className="mt-3 max-w-md font-serif text-4xl text-[#211F20]">
              A little time for yourself.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#746B62]">
              Discover our collection of beauty and salon services. Find the
              treatment that feels right for you.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#633B45] transition hover:text-[#211F20]"
            >
              Browse Services
              <ArrowUpRight size={17} />
            </Link>
          </div>

          <div className="flex flex-col justify-between border border-[#D8CEC1] bg-white p-8 sm:p-10">
            <div>
              <p className="sb-label text-[#AA8964]">NEED ASSISTANCE?</p>

              <h3 className="mt-4 font-serif text-3xl text-[#211F20]">
                We&apos;re here to help.
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#746B62]">
                Your SalonBook experience should feel simple and effortless.
              </p>
            </div>

            <Link
              href="/services"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#633B45]"
            >
              Explore SalonBook
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </Container>
    </main>
  );
}
