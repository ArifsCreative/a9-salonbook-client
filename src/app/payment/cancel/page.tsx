import Link from "next/link";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F3ED] px-4 py-20">
      <section className="w-full max-w-xl border border-[#E7E0D8] bg-white px-7 py-14 text-center md:px-12">
        <XCircle
          size={48}
          strokeWidth={1.3}
          className="mx-auto text-[#AA8964]"
        />

        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-[#AA8964]">
          SalonBook Payment
        </p>

        <h1 className="mt-3 font-serif text-3xl text-[#211F20]">
          Payment Not Completed
        </h1>

        <p className="mt-5 text-sm leading-7 text-[#766F70]">
          You returned without completing checkout. Your appointment remains
          available in your dashboard, where you can check its payment status
          and try again.
        </p>

        <Link
          href="/customer/appointments"
          className="mt-9 inline-flex bg-[#633B45] px-7 py-3 text-sm font-medium text-white transition hover:bg-[#4F2F38]"
        >
          Back to My Appointments
        </Link>
      </section>
    </main>
  );
}
