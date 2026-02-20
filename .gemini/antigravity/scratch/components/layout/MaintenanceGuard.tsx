"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MaintenanceGuard({
    maintenanceMode,
    children,
}: {
    maintenanceMode: boolean;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        // If maintenance mode is ON
        if (maintenanceMode) {
            // Allow admin routes, login, next internal routes, and maintenance page
            const isAllowed =
                pathname?.startsWith("/admin") ||
                pathname?.startsWith("/api/admin") ||
                pathname?.startsWith("/api/auth") ||
                pathname === "/admin/login" ||
                pathname === "/maintenance";

            if (!isAllowed) {
                router.replace("/maintenance");
            }
        } else {
            // If maintenance mode is OFF but user is on maintenance page, send them home
            if (pathname === "/maintenance") {
                router.replace("/");
            }
        }
    }, [maintenanceMode, pathname, router]);

    // Don't render children if we are redirecting to maintenance (flash prevention)
    // But since we do client-side redirect, we might show content briefly.
    // For better security, we'd use Middleware, but this meets the "Fail-safe" requirement for now.
    if (maintenanceMode && !pathname?.startsWith("/admin") && !pathname?.startsWith("/api") && pathname !== "/maintenance" && pathname !== "/admin/login") {
        return null;
    }

    return <>{children}</>;
}
