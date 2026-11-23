"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Users, ShieldBan, ShieldCheck } from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

type Customer = {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "customer";
  isBlocked?: boolean;
  createdAt?: string;
};

type CustomersResponse = {
  success: boolean;
  customers?: Customer[];
  message?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function AdminCustomersManager() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");

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
      throw new Error("Your session has expired.");
    }

    return data.token;
  }, []);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(`${API}/api/users/customers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data: CustomersResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load customers.");
      }

      setCustomers(data.customers || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load customers.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadCustomers();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadCustomers]);

  async function updateBlockStatus(customer: Customer) {
    const nextBlocked = !customer.isBlocked;

    const confirmed = window.confirm(
      `Are you sure you want to ${nextBlocked ? "block" : "unblock"} ${customer.name}?`,
    );

    if (!confirmed) return;

    setUpdatingId(customer._id);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API}/api/users/customers/${encodeURIComponent(customer._id)}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isBlocked: nextBlocked }),
        },
      );

      const data: { success: boolean; message?: string } =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update customer.");
      }

      setCustomers((previous) =>
        previous.map((item) =>
          item._id === customer._id
            ? { ...item, isBlocked: nextBlocked }
            : item,
        ),
      );

      setNotice(
        data.message ||
          `Customer ${nextBlocked ? "blocked" : "unblocked"} successfully.`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update customer.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const term = search.trim().toLowerCase();

    return (
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term)
    );
  });

  const blockedCount = customers.filter(
    (customer) => customer.isBlocked,
  ).length;

  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
            Administration
          </p>

          <h1 className="font-serif text-3xl text-[#211F20] md:text-4xl">
            Customer Management
          </h1>

          <p className="mt-2 text-sm text-[#766F70]">
            Review registered customers and manage account access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadCustomers()}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-[#D9D1C8] px-4 py-2.5 text-sm text-[#633B45] transition hover:bg-white disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-[#E7E0D8] bg-white p-6">
          <Users className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Total Customers
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {customers.length}
          </p>
        </div>

        <div className="border border-[#E7E0D8] bg-white p-6">
          <ShieldCheck className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Active Customers
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {customers.length - blockedCount}
          </p>
        </div>

        <div className="border border-[#E7E0D8] bg-white p-6">
          <ShieldBan className="mb-4 text-[#AA8964]" size={24} />
          <p className="text-xs uppercase tracking-wider text-[#766F70]">
            Blocked Customers
          </p>
          <p className="mt-2 font-serif text-3xl text-[#211F20]">
            {blockedCount}
          </p>
        </div>
      </div>

      <div className="border border-[#E7E0D8] bg-white p-5">
        <label
          htmlFor="customer-search"
          className="mb-2 block text-sm font-medium text-[#211F20]"
        >
          Search customers
        </label>

        <input
          id="customer-search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email..."
          className="w-full border border-[#D9D1C8] bg-[#FDFCF9] px-4 py-3 text-sm text-[#211F20] outline-none focus:border-[#AA8964]"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="border border-[#D5E5D6] bg-[#F0F7F0] p-4 text-sm text-[#426448]"
        >
          {notice}
        </p>
      )}

      {loading ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center text-[#766F70]">
          Loading customers...
        </div>
      ) : filteredCustomers.length === 0 && !error ? (
        <div className="border border-[#E7E0D8] bg-white p-12 text-center text-[#766F70]">
          No customers found.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#E7E0D8] bg-white">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-[#F6F3ED] text-xs uppercase tracking-wider text-[#766F70]">
              <tr>
                <th className="px-5 py-4">Customer</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="border-t border-[#EEE8E1]">
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#211F20]">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-xs text-[#766F70]">
                      {customer.email}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-[#766F70]">
                    {formatDate(customer.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 text-xs font-semibold uppercase ${
                        customer.isBlocked
                          ? "bg-[#F4E7E7] text-[#9A4545]"
                          : "bg-[#E8F1E9] text-[#426448]"
                      }`}
                    >
                      {customer.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      disabled={updatingId !== null}
                      onClick={() => void updateBlockStatus(customer)}
                      className={`border px-4 py-2 text-xs font-semibold transition disabled:opacity-50 ${
                        customer.isBlocked
                          ? "border-[#63816B] text-[#426448] hover:bg-[#E8F1E9]"
                          : "border-[#9A4545] text-[#9A4545] hover:bg-[#F4E7E7]"
                      }`}
                    >
                      {updatingId === customer._id
                        ? "Updating..."
                        : customer.isBlocked
                          ? "Unblock"
                          : "Block"}
                    </button>
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
