"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageTracker() {
    const pathname = usePathname();

    useEffect(() => {
        // Don't track admin pages
        if (pathname.startsWith("/admin")) return;

        const track = async () => {
            try {
                await fetch("/api/track", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        path: pathname,
                        referrer: document.referrer || null,
                        userAgent: navigator.userAgent,
                    }),
                });
            } catch {
                // Silent fail
            }
        };

        track();
    }, [pathname]);

    return null;
}
