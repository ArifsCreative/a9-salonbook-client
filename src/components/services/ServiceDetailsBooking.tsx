"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock3,
  CheckCircle2,
  LoaderCircle,
  Sparkles,
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

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export default function ServiceDetailsBooking({
  serviceId,
}: {
  serviceId: string;
}) {
  const router = useRouter();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [message, setMessage] = useState("");

  const today = (() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  })();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);

  useEffect(() => {
    let cancelled = false;

    const fetchService = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const baseUrl = apiUrl.replace(/\/$/, "");

        // Retrieve authenticated customer JWT
        const tokenResponse = await fetch(`${baseUrl}/api/auth/token`, {
          credentials: "include",
        });

        if (!tokenResponse.ok) {
          router.replace("/sign-in");
          return;
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.token) {
          router.replace("/sign-in");
          return;
        }

        const headers = {
          Authorization: `Bearer ${tokenData.token}`,
        };

        // Verify customer role
        const profileResponse = await fetch(`${baseUrl}/api/profile/me`, {
          headers,
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok || !profileData.success) {
          throw new Error("Unable to verify your account.");
        }

        if (profileData.profile.role !== "customer") {
          router.replace("/admin");
          return;
        }

        // Retrieve service details
        const response = await fetch(`${baseUrl}/api/services/${serviceId}`, {
          headers,
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Unable to retrieve service details.",
          );
        }

        if (!cancelled) {
          setService(data.service);
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

    void fetchService();

    return () => {
      cancelled = true;
    };
  }, [serviceId, router]);

  const handleBooking = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!appointmentDate || !timeSlot) {
      setError("Please select your preferred appointment date and time.");
      return;
    }

    if (appointmentDate < today) {
      setError("Please select today or a future date.");
      return;
    }

    setSubmitting(true);

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
        router.replace("/sign-in");
        return;
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        router.replace("/sign-in");
        return;
      }

      const response = await fetch(`${baseUrl}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({
          serviceId,
          appointmentDate,
          timeSlot,
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit your appointment.");
      }

      setSuccess("Your appointment request has been submitted successfully.");

      setAppointmentDate("");
      setTimeSlot("");
      setMessage("");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#F6F3ED]">
        <div className="flex items-center gap-3 text-sm text-[#746B62]">
          <LoaderCircle size={21} className="animate-spin" />
          Preparing your service experience...
        </div>
      </main>
    );
  }

  if (error && !service) {
    return (
      <main className="min-h-[70vh] bg-[#F6F3ED] py-24">
        <Container>
          <div className="mx-auto max-w-xl border border-[#D8CEC1] bg-white p-10 text-center">
            <h1 className="font-serif text-3xl text-[#211F20]">
              Service unavailable.
            </h1>
            <p className="mt-4 text-sm text-[#746B62]">{error}</p>
            <Link
              href="/services"
              className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#633B45]"
            >
              <ArrowLeft size={16} />
              Return to Services
            </Link>
          </div>
        </Container>
      </main>
    );
  }

  if (!service) return null;

  return (
    <main className="min-h-screen bg-[#F6F3ED]">
      <section className="bg-[#211F20] py-12 text-white sm:py-16">
        <Container>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs text-[#C3A982] transition hover:text-white"
          >
            <ArrowLeft size={15} />
            BACK TO THE COLLECTION
          </Link>

          <div className="mt-10 max-w-3xl">
            <p className="sb-label text-[#C3A982]">THE SALONBOOK EXPERIENCE</p>

            <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-7xl">
              Discover your
              <br />
              <span className="italic text-[#C3A982]">
                {service.serviceName}.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-[#D8CEC1]">
              An experience designed around your time, your style and your
              wellbeing.
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <section className="grid gap-12 py-14 lg:grid-cols-[1fr_0.9fr] lg:gap-16 lg:py-20">
          {/* Service Information */}
          <div>
            <div className="relative aspect-[4/4.2] overflow-hidden bg-[#EAE5DD]">
              {service.image ? (
                <div
                  role="img"
                  aria-label={service.serviceName}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url("${service.image}")`,
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center font-serif text-6xl text-[#AA8964]">
                  SB.
                </div>
              )}

              <span className="absolute bottom-5 left-5 bg-[#F6F3ED] px-5 py-3 text-xs font-semibold uppercase tracking-widest text-[#633B45]">
                {service.category}
              </span>
            </div>

            <div className="mt-9">
              <p className="sb-label text-[#AA8964]">
                ABOUT THIS EXPERIENCE / 01
              </p>

              <h2 className="mt-4 font-serif text-4xl text-[#211F20]">
                The details matter.
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#746B62]">
                {service.description}
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 border-y border-[#D8CEC1] py-7">
              <div>
                <p className="text-xs text-[#746B62]">Service duration</p>
                <div className="mt-3 flex items-center gap-2 text-[#211F20]">
                  <Clock3 size={18} className="text-[#AA8964]" />
                  <span className="font-semibold">
                    {service.duration} minutes
                  </span>
                </div>
              </div>

              <div className="border-l border-[#D8CEC1] pl-7">
                <p className="text-xs text-[#746B62]">Experience price</p>
                <p className="mt-3 font-serif text-2xl text-[#633B45]">
                  {formatPrice(service.price)}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div id="booking">
            <div className="border border-[#D8CEC1] bg-white p-7 sm:p-9">
              <div className="flex items-center gap-3">
                <Sparkles size={19} className="text-[#AA8964]" />
                <p className="sb-label text-[#633B45]">MAKE IT YOURS / 02</p>
              </div>

              <h2 className="mt-5 font-serif text-4xl text-[#211F20]">
                Request an appointment.
              </h2>

              <p className="mt-4 text-sm leading-7 text-[#746B62]">
                Choose your preferred date and time to submit your booking
                request.
              </p>

              <form onSubmit={handleBooking} className="mt-9 space-y-6">
                <div>
                  <label
                    htmlFor="appointmentDate"
                    className="mb-2 block text-xs font-semibold text-[#211F20]"
                  >
                    Preferred appointment date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={18}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#AA8964]"
                    />

                    <input
                      id="appointmentDate"
                      type="date"
                      min={today}
                      required
                      value={appointmentDate}
                      onChange={(event) =>
                        setAppointmentDate(event.target.value)
                      }
                      className="h-13 w-full border border-[#D8CEC1] bg-white pl-12 pr-4 text-sm text-[#211F20] outline-none focus:border-[#AA8964]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-xs font-semibold text-[#211F20]">
                    Preferred time
                  </label>

                  <div className="grid grid-cols-3 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        aria-pressed={timeSlot === slot}
                        className={`border px-2 py-3 text-xs transition ${
                          timeSlot === slot
                            ? "border-[#633B45] bg-[#633B45] text-white"
                            : "border-[#D8CEC1] text-[#746B62] hover:border-[#AA8964]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>

                  <p className="mt-3 text-[11px] leading-5 text-[#9B9187]">
                    These are preferred time choices, not live availability.
                    Your request will be checked against existing bookings.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-semibold text-[#211F20]"
                  >
                    Additional message (optional)
                  </label>

                  <textarea
                    id="message"
                    rows={4}
                    maxLength={500}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Anything you would like us to know?"
                    className="w-full resize-y border border-[#D8CEC1] bg-white p-4 text-sm text-[#211F20] outline-none placeholder:text-[#9B9187] focus:border-[#AA8964]"
                  />

                  <p className="mt-1 text-right text-[10px] text-[#9B9187]">
                    {message.length}/500
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="border border-[#A54E48]/30 bg-[#A54E48]/5 p-4 text-sm text-[#A54E48]"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="border border-[#63816B]/30 bg-[#63816B]/5 p-4 text-sm text-[#45694D]"
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 size={18} />
                      Request submitted
                    </div>

                    <p className="mt-2 leading-6">{success}</p>

                    <Link
                      href="/customer/appointments"
                      className="mt-3 inline-flex items-center gap-2 font-semibold underline underline-offset-4"
                    >
                      View My Appointments
                      <ArrowUpRight size={15} />
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex min-h-14 w-full items-center justify-center gap-3 bg-[#633B45] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#211F20] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Submitting request...
                    </>
                  ) : (
                    <>
                      Request Appointment
                      <ArrowUpRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] leading-5 text-[#9B9187]">
                  Your appointment will remain pending until the salon confirms
                  it.
                </p>
              </form>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
