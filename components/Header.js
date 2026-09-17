"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const NAV = [
  { label: "PDF Tools", href: "/pdf-tools" },
  { label: "Blog", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" }
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated" && session?.user?.userType === "customer";

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" aria-label="SwiftPDF home">
          <Logo />
          <span className="font-display text-lg font-semibold text-ink">SwiftPDF</span>
        </Link>

        <nav aria-label="Primary" className="hidden gap-8 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium transition-colors ${active ? "text-ink" : "text-ink/60 hover:text-ink"}`}
              >
                {item.label}
                {active && <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-brand" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-ink/60 hover:text-ink">
                {session.user.name || session.user.email}
              </Link>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-ink/60 hover:text-ink"
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm font-medium text-ink/60 hover:text-ink">
              Log in
            </Link>
          )}
          <Link
            href="/pdf-tools"
            className="rounded-card bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Explore PDF Tools
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink md:hidden"
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-ink/10 bg-paper px-6 py-4 md:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-ink/10 pt-3">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink/70 hover:bg-ink/5"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-ink/70 hover:bg-ink/5">
                  Log in
                </Link>
              )}
              <Link
                href="/pdf-tools"
                onClick={() => setMenuOpen(false)}
                className="rounded-card bg-brand px-4 py-2.5 text-center text-sm font-semibold text-white"
              >
                Explore PDF Tools
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function Logo() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="19" height="26" rx="3" fill="#004D40" />
      <path d="M23 3l6 6h-6V3z" fill="#0B6B5C" />
      <path d="M9 21l4-9 3 6 3-4 4 7" stroke="#FAFAF8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
