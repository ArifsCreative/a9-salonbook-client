
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Check,
  Clock3,
  RefreshCw,
  X,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type Appointment = {
  _id: string;
  customerId: string;
  appointmentDate: string;
  timeSlot: string;
  servicePrice: number;
  status: AppointmentStatus;
  paymentStatus: "unpaid" | "paid";
  message?: string;
  serviceId: {
    _id: string;
    serviceName: string;
    category?: string;
  } | null;
};

type AppointmentsResponse = {
  success: boolean;
  appointments?: Appointment[];
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function AdminAppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | AppointmentStatus>("all");

  const getToken = useCallback(async () => {
    const response = await fetch(`${API}/api/auth/token`, {
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Please sign in as an administrator.");
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

      const response = await fetch(
        `${API}/api/appointments/admin/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data: AppointmentsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load appointments.");
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
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

  async function updateStatus(
    id: string,
    status: "confirmed" | "cancelled"
  ) {
    const action = status === "confirmed" ? "confirm" : "cancel";

    if (!window.confirm(`Are you sure you want to ${action} this appointment?`)) {
      return;
    }

    setUpdatingId(id);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API}/api/appointments/admin/${id}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data: {
        success: boolean;
        message?: string;
        appointment?: Appointment;
      } = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update appointment.");
      }

      setAppointments((current) =>
        current.map((appointment) =>
          appointment._id === id
            ? { ...appointment, status }
            : appointment
        )
      );

      setNotice(`Appointment ${status} successfully.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update appointment."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const visibleAppointments = appointments.filter(
    (appointment) => filter === "all" || appointment.status === filter
  );

  const counts = {
    all: appointments.length,
    pending: appointments.filter((item) => item.status === "pending").length,
    confirmed: appointments.filter((item) => item.status === "confirmed").length,
    cancelled: appointments.filter((item) => item.status === "cancelled").length,
  };

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
            Reservation Administration
          </p>

          <h1 className="font-serif text-3xl text-[#211F20] md:text-4xl">
            Appointment Management
          </h1>

          <p className="mt-2 text-sm text-[#766F70]">
            Review customer bookings and manage appointment requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadAppointments()}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#D9D1C8] px-4 py-2.5 text-sm text-[#633B45] transition hover:bg-white disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {(["all", "pending", "confirmed", "cancelled"] as const).map(
          (item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`border p-5 text-left transition ${
                filter === item
                  ? "border-[#633B45] bg-[#633B45] text-white"
                  : "border-[#E7E0D8] bg-white text-[#211F20] hover:border-[#AA8964]"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.15em] opacity-75">
                {item}
              </p>

              <p className="mt-3 font-serif text-3xl">{counts[item]}</p>
            </button>
          )
        )}
      </div>

      {error && (
        <div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {notice && (
        <div role="status" className="border border-[#D8E5D8] bg-[#F1F7F1] p-4 text-sm text-[#426448]">
          {notice}
        </div>
      )}

      {loading ? (
        <div className="border border-[#E7E0D8] bg-white p-10 text-center text-[#766F70]">
          Loading appointments...
        </div>
      ) : visibleAppointments.length === 0 && !error ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center">
          <CalendarDays className="mx-auto mb-4 text-[#AA8964]" size={32} />

          <h2 className="font-serif text-2xl text-[#211F20]">
            No appointments found
          </h2>

          <p className="mt-2 text-sm text-[#766F70]">
            There are no appointments in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleAppointments.map((appointment) => (
            <article
              key={appointment._id}
              className="border border-[#E7E0D8] bg-white p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-[0.15em] text-[#AA8964]">
                    {appointment.serviceId?.category || "Salon Service"}
                  </p>

                  <h2 className="font-serif text-2xl text-[#211F20]">
                    {appointment.serviceId?.serviceName ||
                      "Service Unavailable"}
                  </h2>

                  <p className="mt-2 text-xs text-[#766F70]">
                    Booking ID: {appointment._id}
                  </p>
                </div>

                <span
                  className={`px-3 py-1.5 text-xs font-semibold uppercase ${
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

              <div className="mt-6 grid gap-4 border-t border-[#EEE8E1] pt-5 text-sm text-[#655E5F] sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} className="text-[#AA8964]" />
                  {formatDate(appointment.appointmentDate)}
                </div>

                <div className="flex items-center gap-2">
                  <Clock3 size={16} className="text-[#AA8964]" />
                  {appointment.timeSlot}
                </div>

                <div>
                  Payment:{" "}
                  <span className="font-medium capitalize">
                    {appointment.paymentStatus}
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

              {appointment.status === "pending" && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#EEE8E1] pt-5">
                  <button
                    type="button"
                    disabled={updatingId === appointment._id}
                    onClick={() =>
                      void updateStatus(appointment._id, "confirmed")
                    }
                    className="inline-flex items-center gap-2 bg-[#633B45] px-5 py-2.5 text-sm text-white transition hover:bg-[#4F2F38] disabled:opacity-50"
                  >
                    <Check size={16} />
                    Confirm
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === appointment._id}
                    onClick={() =>
                      void updateStatus(appointment._id, "cancelled")
                    }
                    className="inline-flex items-center gap-2 border border-[#B98585] px-5 py-2.5 text-sm text-[#8D4141] transition hover:bg-[#F9EEEE] disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Link
          href="/admin"
          className="text-sm font-medium text-[#633B45] underline underline-offset-4"
        >
          Back to Admin Dashboard
        </Link>
      </div>
    </section>
  );
}
