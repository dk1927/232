import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function requireAuth() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return null;
}

export async function requireAdmin() {
    const session = await getServerSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: { username: session.user?.name || "" },
    });

    if (!user || user.role !== "ADMIN") {
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
