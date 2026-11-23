"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, RefreshCw } from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Transaction = {
  _id: string;
  amount: number;
  currency?: string;
  status: string;
  createdAt?: string;
  stripeSessionId?: string;
  appointmentId?: {
    _id: string;
    appointmentDate?: string;
    timeSlot?: string;
    status?: string;
  } | null;
};

type HistoryResponse = {
  success: boolean;
  transactions?: Transaction[];
  message?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
}

function formatAmount(amount: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${amount} ${currency.toUpperCase()}`;
  }
}

export default function CustomerPaymentHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const tokenResponse = await fetch(`${API}/api/auth/token`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!tokenResponse.ok) {
        throw new Error("Please sign in to view your payment history.");
      }

      const tokenData: { token?: string } = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(`${API}/api/transactions/my`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const data: HistoryResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load payment history.");
      }

      setTransactions(data.transactions || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load payment history.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTransactions();
  }, [loadTransactions]);

  const paidTransactions = transactions.filter(
    (transaction) => transaction.status.toLowerCase() === "paid",
  );

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
            Your Account
          </p>

          <h1 className="font-serif text-3xl text-[#211F20] md:text-4xl">
            Payment History
          </h1>

          <p className="mt-2 text-sm text-[#766F70]">
            Review your salon appointment payment transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadTransactions()}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#D9D1C8] px-4 py-2.5 text-sm text-[#633B45] transition hover:bg-white disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="border border-[#E7E0D8] bg-white p-6">
          <CreditCard className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Total Transactions
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {transactions.length}
          </p>
        </div>

        <div className="border border-[#E7E0D8] bg-white p-6">
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Successful Payments
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {paidTransactions.length}
          </p>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center text-[#766F70]">
          Loading payment history...
        </div>
      ) : !error && transactions.length === 0 ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center">
          <p className="font-serif text-xl text-[#211F20]">No payments yet</p>
          <p className="mt-2 text-sm text-[#766F70]">
            Your transactions will appear here after checkout.
          </p>
          <Link
            href="/customer/appointments"
            className="mt-5 inline-block text-sm font-medium text-[#633B45] underline underline-offset-4"
          >
            View My Appointments
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E7E0D8] bg-white">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-[#F6F3ED] text-xs uppercase tracking-wider text-[#766F70]">
              <tr>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Appointment</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => {
                const isPaid = transaction.status.toLowerCase() === "paid";

                return (
                  <tr
                    key={transaction._id}
                    className="border-t border-[#EEE8E1]"
                  >
                    <td className="px-5 py-4 text-[#766F70]">
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-medium text-[#211F20]">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                          isPaid
                            ? "bg-[#E8F1E9] text-[#426448]"
                            : "bg-[#F4E7E7] text-[#9A4545]"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-[#766F70]">
                      {transaction.appointmentId?.appointmentDate
                        ? formatDate(transaction.appointmentId.appointmentDate)
                        : "—"}
                      {transaction.appointmentId?.timeSlot
                        ? ` · ${transaction.appointmentId.timeSlot}`
                        : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Link
        href="/customer/appointments"
        className="inline-block text-sm font-medium text-[#633B45] underline underline-offset-4"
      >
        Back to My Appointments
      </Link>
    </section>
  );
}
