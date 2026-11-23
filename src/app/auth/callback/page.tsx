"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const verifyAccount = async () => {
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
          throw new Error("Unable to verify your Google session.");
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.token) {
          throw new Error("Authentication token is unavailable.");
        }

        const profileResponse = await fetch(`${baseUrl}/api/profile/me`, {
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        });

        const profileData = await profileResponse.json();

        if (
          !profileResponse.ok ||
          !profileData.success ||
          !profileData.profile
        ) {
          throw new Error(
            profileData.message || "Unable to verify your account.",
          );
        }

        if (cancelled) return;

        if (profileData.profile.isBlocked) {
          await signOut();
          throw new Error("Your account has been blocked.");
        }

        const role = profileData.profile.role;

        if (role === "admin") {
          router.replace("/admin");
        } else if (role === "customer") {
          router.replace("/customer");
        } else {
          await signOut();
          throw new Error("Your account has an unrecognized role.");
        }

        router.refresh();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to complete Google sign-in.",
          );
        }
      }
    };

    void verifyAccount();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6F3ED] px-6">
      <div className="w-full max-w-md border border-[#D8CEC1] bg-white p-10 text-center">
        {error ? (
          <>
            <h1 className="font-serif text-3xl text-[#211F20]">
              Sign-in unsuccessful.
            </h1>
            <p role="alert" className="mt-4 text-sm text-[#746B62]">
              {error}
            </p>
            <button
              type="button"
              onClick={() => router.replace("/sign-in")}
              className="mt-7 bg-[#633B45] px-6 py-3 text-sm font-semibold text-white"
            >
              Return to Sign In
            </button>
          </>
        ) : (
          <>
            <LoaderCircle
              size={30}
              className="mx-auto animate-spin text-[#AA8964]"
            />
            <h1 className="mt-6 font-serif text-3xl text-[#211F20]">
              Preparing your experience.
            </h1>
            <p className="mt-3 text-sm text-[#746B62]">
              Verifying your account securely...
            </p>
          </>
        )}
      </div>
    </main>
  );
}
