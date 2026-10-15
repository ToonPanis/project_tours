"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * On the success page while the payment isn't confirmed yet: asks the server
 * for the page again every few seconds (router.refresh re-renders the Server
 * Component, which reads the order again). Stops after about a minute.
 */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let rounds = 0;
    const timer = window.setInterval(() => {
      rounds += 1;
      if (rounds > 20) window.clearInterval(timer);
      else router.refresh();
    }, 3000);
    return () => window.clearInterval(timer);
  }, [router]);
  return null;
}
