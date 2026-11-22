import { Suspense } from "react";
import PaymentSuccessContent from "@/components/payment/PaymentSuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F6F3ED] px-4 py-24 text-center text-[#766F70]">
          Checking your payment...
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
