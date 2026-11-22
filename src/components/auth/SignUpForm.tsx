"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowUpRight, LoaderCircle } from "lucide-react";
import { signUp } from "@/lib/auth-client";

export default function SignUpForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      setSuccess("Your SalonBook account has been created successfully.");

      router.replace("/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create your account. Please try again.",
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
        <p className="sb-label text-[#AA8964]">BEGIN YOUR EXPERIENCE</p>

        <h1 className="mt-4 font-serif text-5xl leading-tight text-[#211F20] sm:text-6xl">
          Create your
          <br />
          <span className="italic text-[#633B45]">account.</span>
        </h1>

        <p className="mt-4 text-sm leading-7 text-[#746B62]">
          Join SalonBook and discover a more thoughtful way to explore and
          manage your beauty experiences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-xs font-semibold text-[#211F20]"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter your full name"
            className={inputClass}
          />
        </div>

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
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#746B62] hover:text-[#633B45]"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-xs font-semibold text-[#211F20]"
          >
            Confirm password
          </label>

          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#746B62] hover:text-[#633B45]"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

        {success && (
          <div
            role="status"
            className="border border-[#73836E]/30 bg-[#73836E]/5 px-4 py-3 text-sm text-[#52664D]"
          >
            {success}
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
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowUpRight size={18} />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 border-t border-[#D8CEC1] pt-6 text-center">
        <p className="text-sm text-[#746B62]">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#633B45] underline underline-offset-4 hover:text-[#211F20]"
          >
            Sign in
          </Link>
        </p>
      </div>

      <p className="mt-7 text-center text-[10px] leading-6 tracking-wide text-[#9B9187]">
        By creating an account, you agree to use SalonBook responsibly and keep
        your account credentials secure.
      </p>
    </div>
  );
}
