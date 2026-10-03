"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag: (command: string, ...args: (string | Date | Record<string, string>)[]) => void;
  }
}

export default function SessionHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: `${window.location.origin}${pathname}`,
        page_title: document.title,
      });
    }

    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem("sessionId", sessionId);
    }

    const pageViewKey = `page-view:${sessionId}:${pathname}`;
    if (localStorage.getItem(pageViewKey) === "complete") return;
    localStorage.setItem(pageViewKey, "pending");

    fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        path: pathname,
        title: document.title,
        referrer: document.referrer,
        language: navigator.language,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        },
      }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(
            `Page-view tracking failed (${response.status}): ${result?.error || "Unknown server error"}`
          );
        }
        if (result?.notified) {
          localStorage.setItem(pageViewKey, "complete");
        }
      })
      .catch((error) => {
        localStorage.removeItem(pageViewKey);
        console.error("Could not record page view:", error);
      });
  }, [pathname]);

  return <></>;
}
