"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Clock3, AlertCircle } from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type PaymentState = "checking" | "paid" | "pending" | "error";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<PaymentState>("checking");
  const [message, setMessage] = useState(
    "Verifying your payment with our secure server...",
  );

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;

    async function verifyPayment() {
      for (let attempt = 0; attempt < 8; attempt++) {
        if (cancelled) return;

        try {
          const tokenResponse = await fetch(`${API}/api/auth/token`, {
            credentials: "include",
            cache: "no-store",
          });

          if (!tokenResponse.ok) {
            throw new Error("Please sign in to verify your payment.");
          }

          const tokenData: { token?: string } = await tokenResponse.json();

          if (!tokenData.token) {
            throw new Error("Your session has expired.");
          }

          const response = await fetch(
            `${API}/api/payments/status/${encodeURIComponent(sessionId!)}`,
            {
              headers: {
                Authorization: `Bearer ${tokenData.token}`,
              },
              cache: "no-store",
            },
          );

          const data: {
            success: boolean;
            paid?: boolean;
            message?: string;
          } = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Verification failed.");
          }

          if (data.paid) {
            if (!cancelled) {
              setStatus("paid");
              setMessage("Your payment has been verified successfully.");
            }
            return;
          }
        } catch (error) {
          if (!cancelled) {
            setStatus("error");
            setMessage(
              error instanceof Error
                ? error.message
                : "Unable to verify payment.",
            );
          }
          return;
        }

        await new Promise<void>((resolve) => setTimeout(resolve, 2000));
      }

      if (!cancelled) {
        setStatus("pending");
        setMessage(
          "Your payment has not yet been confirmed by our server. Please check your appointments shortly.",
        );
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const effectiveStatus = sessionId ? status : "error";

  const effectiveMessage = sessionId
    ? message
    : "Missing Stripe payment session ID.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F3ED] px-4 py-20">
      <section className="w-full max-w-xl border border-[#E7E0D8] bg-white px-7 py-14 text-center md:px-12">
        {effectiveStatus === "paid" ? (
          <CheckCircle2
            size={48}
            strokeWidth={1.3}
            className="mx-auto text-[#63816B]"
          />
        ) : effectiveStatus === "error" ? (
          <AlertCircle
            size={48}
            strokeWidth={1.3}
            className="mx-auto text-[#9A4545]"
          />
        ) : (
          <Clock3
            size={48}
            strokeWidth={1.3}
            className="mx-auto text-[#AA8964]"
          />
        )}

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
          SalonBook Payment
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#211F20]">
          {effectiveStatus === "paid"
            ? "Payment Successful"
            : effectiveStatus === "checking"
              ? "Verifying Payment"
              : effectiveStatus === "pending"
                ? "Payment Processing"
                : "Verification Unavailable"}
        </h1>

        <p role="status" className="mt-5 text-sm leading-7 text-[#766F70]">
          {effectiveMessage}
        </p>

        <Link
          href="/customer/appointments"
          className="mt-9 inline-flex bg-[#633B45] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#4F2F38]"
        >
          View My Appointments
        </Link>
      </section>
    </main>
  );
}
