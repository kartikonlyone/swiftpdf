"use client";

import { SessionProvider } from "next-auth/react";

/**
 * Wraps the whole app so next-auth's client hooks (useSession, signIn,
 * signOut) work reliably everywhere, and so the session refetches itself
 * automatically when the window regains focus or the network reconnects —
 * without this, client components have no shared session state and can
 * show stale logged-out UI until a full reload.
 */
export default function SessionProviderWrapper({ children }) {
  return (
    <SessionProvider refetchOnWindowFocus={true} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
}
