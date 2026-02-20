import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

// Service Layer for Site Settings (Rule: API First / No Hardcoding)

export async function getSiteSettings() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: "settings" },
        });

        if (!settings) {
            logger.info("Site settings not found, creating default");
            settings = await prisma.siteSettings.create({
                data: {
                    id: "settings",
                    siteName: "Portfolio",
                    maintenanceMode: false,
                },
            });
        }
        return settings;
    } catch (error) {
        logger.error("Failed to fetch site settings", { error });
        // Return fallback to prevent crash
        return {
            siteName: "Portfolio",
            siteDescription: "Portfolio",
            footerTagline: "Minimalist Tech Professional",
            githubUrl: "https://github.com",
            linkedinUrl: "#",
            email: "hello@example.com",
            maintenanceMode: false,
            maintenanceMessage: "Systems under maintenance",
        };
    }
}

export async function updateMaintenanceMode(enabled: boolean, message?: string) {
    try {
        const result = await prisma.siteSettings.upsert({
            where: { id: "settings" },
            update: {
                maintenanceMode: enabled,
                ...(message && { maintenanceMessage: message })
            },
            create: {
                id: "settings",
                maintenanceMode: enabled,
                maintenanceMessage: message
            }
        });
        logger.warn(`Maintenance mode ${enabled ? "ENABLED" : "DISABLED"}`, { adminUser: "system" }); // In real app, pass user
        return result;
    } catch (error) {
        logger.error("Failed to update maintenance mode", { error });
        throw error;
    }
}
