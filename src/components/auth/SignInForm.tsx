"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowUpRight, LoaderCircle } from "lucide-react";
import { signIn, signOut } from "@/lib/auth-client";

export default function SignInForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Authenticate using Better Auth
      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(result.error.message || "Invalid email or password.");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      // Step 2: Retrieve a fresh JWT from Better Auth
      const tokenResponse = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/auth/token`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!tokenResponse.ok) {
        throw new Error("Unable to retrieve your authentication token.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token || typeof tokenData.token !== "string") {
        throw new Error("Authentication token was not returned.");
      }

      // Step 3: Retrieve the actual database profile
      const profileResponse = await fetch(
        `${apiUrl.replace(/\/$/, "")}/api/profile/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        },
      );

      const profileData = await profileResponse.json();

      if (!profileResponse.ok || !profileData.success || !profileData.profile) {
        throw new Error(
          profileData.message || "Unable to verify your account.",
        );
      }

      // Step 4: Redirect according to the verified database role
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
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full border border-[#D8CEC1] bg-white px-4 text-sm text-[#211F20] outline-none transition placeholder:text-[#9B9187] focus:border-[#AA8964]";

  return (
    <div className="w-full max-w-md">
      <div className="mb-9">
        <p className="sb-label text-[#AA8964]">WELCOME BACK TO SALONBOOK</p>

        <h1 className="mt-4 font-serif text-5xl leading-tight text-[#211F20] sm:text-6xl">
          Your moment.
          <br />
          <span className="italic text-[#633B45]">Your account.</span>
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#746B62]">
          Sign in to explore your beauty experiences and manage your SalonBook
          appointments.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-xs font-semibold text-[#211F20]"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-xs font-semibold text-[#211F20]"
          >
            Password
          </label>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#746B62] transition hover:text-[#633B45]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="border border-[#A54E48]/30 bg-[#A54E48]/5 px-4 py-3 text-sm text-[#A54E48]"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex h-13 w-full items-center justify-center gap-3 bg-[#633B45] px-6 text-sm font-semibold text-white transition hover:bg-[#211F20] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-[#D8CEC1] pt-6 text-center">
        <p className="text-sm text-[#746B62]">
          New to SalonBook?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-[#633B45] underline underline-offset-4 transition hover:text-[#211F20]"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
