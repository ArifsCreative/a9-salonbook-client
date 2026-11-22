"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  CreditCard,
  RefreshCw,
  Scissors,
} from "lucide-react";
import Link from "next/link";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Appointment = {
  _id: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  message?: string;
  serviceId: {
    _id: string;
    serviceName: string;
    category?: string;
    image?: string;
  } | null;
};

type AppointmentResponse = {
  success: boolean;
  appointments?: Appointment[];
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);

  const getToken = useCallback(async () => {
    const response = await fetch(`${API}/api/auth/token`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Please sign in to view your appointments.");
    }

    const data: { token?: string } = await response.json();

    if (!data.token) {
      throw new Error("Your session has expired. Please sign in again.");
    }

    return data.token;
  }, []);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(`${API}/api/appointments/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: AppointmentResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load appointments.");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadAppointments();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadAppointments]);

  async function payForAppointment(id: string) {
    setPayingId(id);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(`${API}/api/payments/checkout/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: {
        success: boolean;
        checkoutUrl?: string;
        message?: string;
      } = await response.json();

      if (!response.ok || !data.success || !data.checkoutUrl) {
        throw new Error(data.message || "Unable to start payment.");
      }

      const checkoutUrl = new URL(data.checkoutUrl);

      if (
        checkoutUrl.protocol !== "https:" ||
        !(
          checkoutUrl.hostname === "checkout.stripe.com" ||
          checkoutUrl.hostname.endsWith(".checkout.stripe.com")
        )
      ) {
        throw new Error("Invalid Stripe Checkout URL.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment could not be started.",
      );
      setPayingId(null);
    }
  }

  async function cancelAppointment(id: string) {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    setCancellingId(id);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(`${API}/api/appointments/${id}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to cancel appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status: "cancelled" }
            : appointment,
        ),
      );

      setNotice("Your appointment has been cancelled successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Cancellation failed.");
    } finally {
      setCancellingId(null);
    }
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
            Your Reservations
          </p>

          <h2 className="font-serif text-3xl text-[#211F20] md:text-4xl">
            My Appointments
          </h2>

          <p className="mt-2 text-sm text-[#766F70]">
            Review your bookings and manage pending reservations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAppointments()}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#D9D1C8] px-4 py-2.5 text-sm text-[#633B45] transition hover:bg-[#F6F3ED] disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="border border-[#D8E5D8] bg-[#F1F7F1] px-5 py-4 text-sm text-[#426448]"
        >
          {notice}
        </div>
      )}

      {loading ? (
        <div className="border border-[#E7E0D8] bg-white p-10 text-center text-[#766F70]">
          Loading your appointments...
        </div>
      ) : appointments.length === 0 && !error ? (
        <div className="border border-[#E7E0D8] bg-white px-6 py-16 text-center">
          <Scissors
            size={34}
            strokeWidth={1.3}
            className="mx-auto mb-5 text-[#AA8964]"
          />

          <h3 className="font-serif text-2xl text-[#211F20]">
            No appointments yet
          </h3>

          <p className="mt-3 text-sm text-[#766F70]">
            Your salon experience begins with a reservation.
          </p>

          <Link
            href="/services"
            className="mt-6 inline-flex bg-[#633B45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4F2F38]"
          >
            Explore Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {appointments.map((appointment) => (
            <article
              key={appointment._id}
              className="border border-[#E7E0D8] bg-white p-6 md:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#AA8964]">
                    {appointment.serviceId?.category || "Salon Service"}
                  </p>

                  <h3 className="font-serif text-2xl text-[#211F20]">
                    {appointment.serviceId?.serviceName ||
                      "Service Unavailable"}
                  </h3>
                </div>

                <span
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                    appointment.status === "confirmed"
                      ? "bg-[#E8F1E9] text-[#426448]"
                      : appointment.status === "cancelled"
                        ? "bg-[#F4E7E7] text-[#9A4545]"
                        : "bg-[#F5EDDE] text-[#8B6A36]"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>

              <div className="mt-6 grid gap-4 border-t border-[#EEE8E1] pt-6 text-sm text-[#655E5F] sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3">
                  <CalendarDays size={18} className="text-[#AA8964]" />
                  <span>{formatDate(appointment.appointmentDate)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 size={18} className="text-[#AA8964]" />
                  <span>{appointment.timeSlot}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CreditCard size={18} className="text-[#AA8964]" />
                  <span>
                    {appointment.paymentStatus === "paid"
                      ? "Paid"
                      : "Payment Pending"}
                  </span>
                </div>

                <div className="font-semibold text-[#211F20]">
                  ${appointment.servicePrice.toFixed(2)}
                </div>
              </div>

              {appointment.message && (
                <p className="mt-5 border-l-2 border-[#C3A982] pl-4 text-sm text-[#766F70]">
                  {appointment.message}
                </p>
              )}

              {appointment.status === "confirmed" &&
                appointment.paymentStatus === "unpaid" && (
                  <div className="mt-6 flex justify-end border-t border-[#EEE8E1] pt-5">
                    <button
                      type="button"
                      onClick={() => void payForAppointment(appointment._id)}
                      disabled={payingId !== null}
                      className="inline-flex items-center gap-2 bg-[#633B45] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#4F2F38] disabled:opacity-50"
                    >
                      <CreditCard size={17} />
                      {payingId === appointment._id
                        ? "Redirecting to Stripe..."
                        : `Pay Now — $${appointment.servicePrice.toFixed(2)}`}
                    </button>
                  </div>
                )}

              {appointment.status === "pending" && (
                <div className="mt-6 flex justify-end border-t border-[#EEE8E1] pt-5">
                  <button
                    type="button"
                    onClick={() => void cancelAppointment(appointment._id)}
                    disabled={cancellingId === appointment._id}
                    className="border border-[#B98585] px-5 py-2.5 text-sm text-[#8D4141] transition hover:bg-[#F9EEEE] disabled:opacity-50"
                  >
                    {cancellingId === appointment._id
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
