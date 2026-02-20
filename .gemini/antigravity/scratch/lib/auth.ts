import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function requireAuth() {
    const session = await getServerSession();
    if (!session) {
        logger.warn("Unauthorized access attempt", { path: "requireAuth" });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

export async function requireAdmin() {
    const session = await getServerSession();
    if (!session) {
        logger.warn("Unauthorized admin access attempt - No Session", { path: "requireAdmin" });
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: { username: session.user?.name || "" },
    });

    if (!user || user.role !== "ADMIN") {
        logger.warn("Forbidden admin access attempt", {
            user: session.user?.name,
            role: user?.role || "unknown"
        });
        return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    return null;
}

export async function getCurrentUser() {
    const session = await getServerSession();
    if (!session?.user?.name) return null;

    return prisma.user.findFirst({
        where: { username: session.user.name },
    });
}
