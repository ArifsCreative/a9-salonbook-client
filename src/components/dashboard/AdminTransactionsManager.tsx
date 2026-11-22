
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CreditCard, RefreshCw, ReceiptText } from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Transaction = {
  _id: string;
  customerId: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  status: "paid" | "failed";
  createdAt: string;
  appointmentId: {
    _id: string;
    appointmentDate: string;
    timeSlot: string;
    status: string;
  } | null;
};

type TransactionsResponse = {
  success: boolean;
  total?: number;
  totalRevenue?: number;
  transactions?: Transaction[];
  message?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default function AdminTransactionsManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filter, setFilter] = useState<"all" | "paid" | "failed">("all");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const tokenResponse = await fetch(`${API}/api/auth/token`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!tokenResponse.ok) {
        throw new Error("Please sign in as an administrator.");
      }

      const tokenData: { token?: string } =
        await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Your session has expired.");
      }

      const response = await fetch(`${API}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        cache: "no-store",
      });

      const data: TransactionsResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load transactions.");
      }

      setTransactions(data.transactions || []);
      setTotalRevenue(data.totalRevenue || 0);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTransactions();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTransactions]);

  const visibleTransactions = transactions.filter(
    (transaction) =>
      filter === "all" || transaction.status === filter
  );

  const paidCount = transactions.filter(
    (transaction) => transaction.status === "paid"
  ).length;

  const failedCount = transactions.filter(
    (transaction) => transaction.status === "failed"
  ).length;

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
            Financial Overview
          </p>

          <h1 className="font-serif text-3xl text-[#211F20] md:text-4xl">
            Payment Transactions
          </h1>

          <p className="mt-2 text-sm text-[#766F70]">
            Monitor Stripe payments and appointment revenue.
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-[#E7E0D8] bg-white p-6">
          <CreditCard className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Total Revenue
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>

        <div className="border border-[#E7E0D8] bg-white p-6">
          <ReceiptText className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Successful Payments
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {paidCount}
          </p>
        </div>

        <div className="border border-[#E7E0D8] bg-white p-6">
          <ReceiptText className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Failed Payments
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {failedCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "paid", "failed"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`border px-5 py-2.5 text-sm capitalize transition ${
              filter === item
                ? "border-[#633B45] bg-[#633B45] text-white"
                : "border-[#E7E0D8] bg-white text-[#633B45] hover:border-[#AA8964]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="border border-[#E7E0D8] bg-white p-10 text-center text-[#766F70]">
          Loading transactions...
        </div>
      ) : visibleTransactions.length === 0 && !error ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center">
          <ReceiptText className="mx-auto mb-4 text-[#AA8964]" size={32} />
          <h2 className="font-serif text-2xl text-[#211F20]">
            No transactions found
          </h2>
          <p className="mt-2 text-sm text-[#766F70]">
            Transactions will appear here after Stripe payments.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E7E0D8] bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[#F6F3ED] text-xs uppercase tracking-wider text-[#766F70]">
              <tr>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Appointment</th>
                <th className="px-5 py-4">Customer ID</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleTransactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-t border-[#EEE8E1]"
                >
                  <td className="px-5 py-4 text-[#655E5F]">
                    {formatDate(transaction.createdAt)}
                  </td>

                  <td className="px-5 py-4 text-[#211F20]">
                    {transaction.appointmentId
                      ? `${formatDate(transaction.appointmentId.appointmentDate)} · ${transaction.appointmentId.timeSlot}`
                      : "Unavailable"}
                  </td>

                  <td className="px-5 py-4 text-xs text-[#766F70]">
                    {transaction.customerId}
                  </td>

                  <td className="px-5 py-4 font-semibold text-[#211F20]">
                    {transaction.currency.toUpperCase()}{" "}
                    {transaction.amount.toFixed(2)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                        transaction.status === "paid"
                          ? "bg-[#E8F1E9] text-[#426448]"
                          : "bg-[#F4E7E7] text-[#9A4545]"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link
        href="/admin"
        className="inline-block text-sm font-medium text-[#633B45] underline underline-offset-4"
      >
        Back to Admin Dashboard
      </Link>
    </section>
  );
}
