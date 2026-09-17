"use client";

import { signOut } from "next-auth/react";

/**
 * Reusable sign-out control. Always passes an explicit callbackUrl so the
 * person lands somewhere sensible after signing out, rather than next-auth's
 * default (which can leave them on a bare /api/auth/signout confirmation page).
 */
export default function LogoutButton({ callbackUrl = "/", className, children = "Log out" }) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl })}
      className={className || "text-sm font-medium text-ink/60 hover:text-ink"}
    >
      {children}
    </button>
  );
}
