import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Container from "@/components/layout/Container";
import BrandLogo from "@/components/brand/BrandLogo";
import SignInForm from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your SalonBook account and manage your beauty appointments.",
};

export default function SignInPage() {
  return (
    <main className="bg-[#F6F3ED]">
      <Container>
        <div className="grid min-h-[780px] items-center gap-12 py-12 lg:grid-cols-2 lg:gap-20 lg:py-20">
          {/* Sign In Form */}
          <div className="mx-auto w-full max-w-md">
            <div className="mb-12 flex items-center justify-between">
              <BrandLogo />

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-[#746B62] transition hover:text-[#633B45]"
              >
                <ArrowLeft size={15} />
                Back to Home
              </Link>
            </div>

            <SignInForm />
          </div>

          {/* Editorial Brand Panel */}
          <div className="relative hidden min-h-[650px] overflow-hidden bg-[#211F20] lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1400&q=85')",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#211F20]/95 via-[#211F20]/25 to-[#211F20]/10" />

            <div className="absolute inset-x-10 bottom-12">
              <p className="sb-label text-[#C3A982]">
                SALONBOOK / WELCOME BACK
              </p>

              <h2 className="mt-5 max-w-lg font-serif text-6xl leading-[1.08] text-white">
                Make time
                <br />
                <span className="italic text-[#C3A982]">for yourself.</span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#EAE5DD]">
                Your favourite experiences and appointments are waiting for you.
              </p>

              <div className="mt-9 h-px w-16 bg-[#AA8964]" />

              <p className="mt-5 text-[10px] tracking-[0.22em] text-[#C3A982]">
                BEAUTY · EXPERIENCE · BOOKING
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
