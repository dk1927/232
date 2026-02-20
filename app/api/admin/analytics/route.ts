import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Daily visitor counts for last 7 days
    const pageViews = await prisma.pageView.findMany({
        where: { createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true, referrer: true, path: true },
    });

    // Group by day
    const dailyCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};
    const pathCounts: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const key = date.toISOString().split("T")[0];
        dailyCounts[key] = 0;
    }

    pageViews.forEach((pv: { createdAt: Date; referrer: string | null; path: string }) => {
        const day = pv.createdAt.toISOString().split("T")[0];
        if (dailyCounts[day] !== undefined) {
            dailyCounts[day]++;
        }

        // Referrer breakdown
        let source = "직접 방문";
        if (pv.referrer) {
            try {
                const url = new URL(pv.referrer);
                source = url.hostname;
            } catch {
                source = pv.referrer.slice(0, 30);
            }
        }
        referrerCounts[source] = (referrerCounts[source] || 0) + 1;

        // Page path breakdown
        pathCounts[pv.path] = (pathCounts[pv.path] || 0) + 1;
    });

    // Project category distribution
    const projects = await prisma.project.findMany({ select: { tags: true } });
    const categoryCounts: Record<string, number> = {};
    projects.forEach((p: { tags: string }) => {
        try {
            const tags: string[] = JSON.parse(p.tags);
            tags.forEach((tag) => {
                categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
            });
        } catch { /* skip invalid */ }
    });

    // Summary stats
    const [totalMessages, unreadMessages, totalProjects, totalSkills] = await Promise.all([
        prisma.contactMessage.count(),
        prisma.contactMessage.count({ where: { read: false } }),
        prisma.project.count(),
        prisma.skill.count(),
    ]);

    return NextResponse.json({
        dailyVisitors: dailyCounts,
        referrers: referrerCounts,
        topPages: pathCounts,
        projectCategories: categoryCounts,
        stats: {
            totalMessages,
            unreadMessages,
            totalProjects,
            totalSkills,
            totalViews: pageViews.length,
        },
    });
}
