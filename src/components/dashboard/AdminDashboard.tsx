"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Scissors,
  CalendarDays,
  Clock3,
  CheckCircle2,
  CreditCard,
  Wallet,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";

import { signOut } from "@/lib/auth-client";
import Container from "@/components/layout/Container";

interface AdminStats {
  totalCustomers: number;
  activeServices: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  successfulPayments: number;
  totalRevenue: number;
}

const initialStats: AdminStats = {
  totalCustomers: 0,
  activeServices: 0,
  totalAppointments: 0,
  pendingAppointments: 0,
  confirmedAppointments: 0,
  successfulPayments: 0,
  totalRevenue: 0,
};

export default function AdminDashboard() {
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [adminName, setAdminName] = useState("Administrator");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const baseUrl = apiUrl.replace(/\/$/, "");

        // Retrieve the authenticated JWT
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

        // Verify actual administrator identity
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
            profileData.message || "Unable to verify administrator profile.",
          );
        }

        if (profileData.profile.role !== "admin") {
          throw new Error(
            "This dashboard is only available to administrators.",
          );
        }

        // Retrieve real dashboard statistics
        const dashboardResponse = await fetch(
          `${baseUrl}/api/dashboard/admin`,
          { headers },
        );

        const dashboardData = await dashboardResponse.json();

        if (!dashboardResponse.ok || !dashboardData.success) {
          throw new Error(
            dashboardData.message || "Unable to load administrator statistics.",
          );
        }

        if (!cancelled) {
          setAdminName(profileData.profile.name || "Administrator");
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
  }, [refreshKey]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/sign-in");
    router.refresh();
  };

  const statCards = [
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Registered customer accounts",
    },
    {
      label: "Active Services",
      value: stats.activeServices,
      icon: Scissors,
      description: "Currently available services",
    },
    {
      label: "Total Appointments",
      value: stats.totalAppointments,
      icon: CalendarDays,
      description: "All recorded appointments",
    },
    {
      label: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock3,
      description: "Awaiting confirmation",
    },
    {
      label: "Confirmed Appointments",
      value: stats.confirmedAppointments,
      icon: CheckCircle2,
      description: "Successfully confirmed",
    },
    {
      label: "Successful Payments",
      value: stats.successfulPayments,
      icon: CreditCard,
      description: "Completed transactions",
    },
  ];

  const formattedRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(stats.totalRevenue);

  return (
    <main className="min-h-screen bg-[#F6F3ED]">
      {/* Dashboard Header */}
      <section className="bg-[#211F20] py-12 text-white sm:py-16">
        <Container>
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-[#C3A982]">
                <ShieldCheck size={17} />
                <p className="sb-label">SALONBOOK / ADMINISTRATION</p>
              </div>

              <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
                Welcome back,
                <br />
                <span className="italic text-[#C3A982]">{adminName}.</span>
              </h1>

              <p className="mt-4 text-sm leading-7 text-[#D8CEC1]">
                Your business overview, operations and performance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-[#C3A982] px-5 py-3 text-xs font-semibold text-[#211F20] transition hover:bg-white"
              >
                View Services
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
        {/* Statistics */}
        <section className="py-12 sm:py-16">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="sb-label text-[#633B45]">
                BUSINESS INTELLIGENCE / 01
              </p>

              <h2 className="mt-3 font-serif text-4xl text-[#211F20]">
                Business overview.
              </h2>

              <p className="mt-3 text-sm text-[#746B62]">
                Your SalonBook performance at a glance.
              </p>
            </div>

            {!loading && (
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setLoading(true);
                  setRefreshKey((previous) => previous + 1);
                }}
                className="inline-flex items-center gap-2 self-start border border-[#D8CEC1] bg-white px-4 py-3 text-xs font-semibold text-[#633B45] transition hover:border-[#AA8964]"
              >
                <RefreshCw size={15} />
                Refresh Statistics
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-3 text-sm text-[#746B62]">
              <LoaderCircle size={20} className="animate-spin" />
              Loading business statistics...
            </div>
          ) : error ? (
            <div className="border border-[#D8CEC1] bg-white px-6 py-12 text-center">
              <h3 className="font-serif text-2xl text-[#211F20]">
                Unable to load dashboard.
              </h3>

              <p className="mt-3 text-sm text-[#746B62]">{error}</p>

              <button
                type="button"
                onClick={() => {
                  setError("");
                  setLoading(true);
                  setRefreshKey((previous) => previous + 1);
                }}
                className="mt-6 inline-flex items-center gap-2 bg-[#633B45] px-5 py-3 text-xs font-semibold text-white hover:bg-[#211F20]"
              >
                <RefreshCw size={15} />
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((card) => {
                  const Icon = card.icon;

                  return (
                    <div
                      key={card.label}
                      className="border border-[#D8CEC1] bg-white p-6 transition hover:border-[#AA8964]"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#746B62]">
                          {card.label}
                        </span>

                        <Icon size={20} className="text-[#AA8964]" />
                      </div>

                      <p className="mt-6 font-serif text-5xl text-[#211F20]">
                        {card.value.toLocaleString()}
                      </p>

                      <p className="mt-3 text-xs text-[#9B9187]">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Revenue Overview */}
              <div className="mt-6 bg-[#EAE5DD] p-8 sm:p-10">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2 text-[#633B45]">
                      <Wallet size={20} />
                      <p className="sb-label">REVENUE OVERVIEW</p>
                    </div>

                    <p className="mt-5 font-serif text-5xl text-[#211F20] sm:text-6xl">
                      {formattedRevenue}
                    </p>

                    <p className="mt-3 text-sm text-[#746B62]">
                      Total revenue from successful payments.
                    </p>
                  </div>

                  <div className="border-t border-[#CFC4B6] pt-5 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0">
                    <p className="text-xs text-[#746B62]">
                      Successful transactions
                    </p>

                    <p className="mt-3 font-serif text-4xl text-[#633B45]">
                      {stats.successfulPayments.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </Container>
    </main>
  );
}
