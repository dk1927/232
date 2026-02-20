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

    // 1. Sector Expertise (Radar Chart Data)
    // Group by metadata.type and calculate average difficulty
    const projects = await prisma.project.findMany();
    const sectorStats: Record<string, { totalDifficulty: number; count: number }> = {};
    const techStackCounts: Record<string, number> = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    projects.forEach((p: any) => {
        // Sector stats
        let sector = "미분류";
        let difficulty = 0;
        if (p.metadata) {
            try {
                const meta = JSON.parse(p.metadata);
                if (meta.type) sector = meta.type;
                if (meta.difficulty) difficulty = Number(meta.difficulty);
            } catch { /* skip */ }
        }
        if (!sectorStats[sector]) sectorStats[sector] = { totalDifficulty: 0, count: 0 };
        sectorStats[sector].totalDifficulty += difficulty;
        sectorStats[sector].count += 1;

        // Tech stack counts
        try {
            const tags: string[] = JSON.parse(p.tags);
            tags.forEach((tag) => {
                const t = tag.trim();
                if (t) techStackCounts[t] = (techStackCounts[t] || 0) + 1;
            });
        } catch { /* skip */ }
    });

    // Format sector data for Radar chart
    const sectorExpertise = Object.entries(sectorStats).map(([sector, stats]) => ({
        sector,
        avgDifficulty: parseFloat((stats.totalDifficulty / stats.count).toFixed(1)),
        projectCount: stats.count,
    }));

    // Format tech stack for Bar chart (Top 10)
    const topTechStack = Object.entries(techStackCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([tech, count]) => ({ tech, count }));

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
        sectorExpertise,
        topTechStack,
        stats: {
            totalMessages,
            unreadMessages,
            totalProjects,
            totalSkills,
            totalViews: pageViews.length,
        },
    });
}
