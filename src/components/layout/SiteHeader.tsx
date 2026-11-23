"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, UserRound, LogOut, LayoutDashboard } from "lucide-react";
import BrandLogo from "@/components/brand/BrandLogo";
import Container from "./Container";
import ButtonLink from "@/components/ui/ButtonLink";
import { authClient, useSession } from "@/lib/auth-client";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const user = session?.user;
  const isLoggedIn = Boolean(user);
  const role = (user as { role?: string } | undefined)?.role;

  const dashboardHref = role === "admin" ? "/admin" : "/customer";

  const closeMenu = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      closeMenu();
      router.push("/sign-in");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#211F20] text-white">
      <Container>
        <div className="flex h-[76px] items-center justify-between">
          <BrandLogo variant="light" />

          <nav className="hidden items-center gap-9 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[13px] font-medium tracking-wide text-[#D8CEC1] transition hover:text-[#C3A982]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            {!isPending &&
              (isLoggedIn ? (
                <>
                  <ButtonLink
                    href={dashboardHref}
                    variant="secondary"
                    className="min-h-10 px-5 py-2 text-xs"
                  >
                    My Dashboard
                  </ButtonLink>

                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Open profile menu"
                      aria-expanded={profileOpen}
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="flex h-10 w-10 items-center justify-center border border-[#AA8964]/60 text-[#EAE5DD] transition hover:bg-white/10"
                    >
                      <UserRound size={19} />
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 top-12 z-50 w-60 border border-[#AA8964]/30 bg-[#211F20] p-2 shadow-xl">
                        <div className="border-b border-white/10 px-3 py-3">
                          <p className="truncate text-sm font-medium">
                            {user?.name || "My Profile"}
                          </p>
                          <p className="truncate text-xs text-[#C3A982]">
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          href={dashboardHref}
                          onClick={closeMenu}
                          className="flex items-center gap-3 px-3 py-3 text-sm text-[#EAE5DD] hover:bg-white/10"
                        >
                          <LayoutDashboard size={17} />
                          My Dashboard
                        </Link>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-3 px-3 py-3 text-left text-sm text-[#EAE5DD] hover:bg-white/10"
                        >
                          <LogOut size={17} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="text-sm font-medium text-[#EAE5DD] transition hover:text-[#C3A982]"
                  >
                    Sign In
                  </Link>

                  <ButtonLink
                    href="/sign-up"
                    variant="secondary"
                    className="min-h-10 px-5 py-2 text-xs"
                  >
                    Get Started
                  </ButtonLink>
                </>
              ))}
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center border border-white/20 text-[#F6F3ED] transition hover:border-[#AA8964] lg:hidden"
          >
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {mobileOpen && (
          <nav
            id="mobile-navigation"
            className="border-t border-white/10 pb-6 pt-4 lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={closeMenu}
                  className="px-3 py-3 text-sm text-[#EAE5DD] transition hover:bg-white/5 hover:text-[#C3A982]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {!isPending && (
              <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-5">
                {isLoggedIn ? (
                  <>
                    <div className="px-3 text-sm">
                      <p className="font-medium">
                        {user?.name || "My Profile"}
                      </p>
                      <p className="truncate text-xs text-[#C3A982]">
                        {user?.email}
                      </p>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 bg-[#AA8964] px-4 py-3 text-sm font-semibold text-white"
                    >
                      <LayoutDashboard size={17} />
                      My Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3 text-sm"
                    >
                      <LogOut size={17} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      href="/sign-in"
                      onClick={closeMenu}
                      className="flex-1 border border-white/20 px-4 py-3 text-center text-sm"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={closeMenu}
                      className="flex-1 bg-[#AA8964] px-4 py-3 text-center text-sm font-semibold text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
}
