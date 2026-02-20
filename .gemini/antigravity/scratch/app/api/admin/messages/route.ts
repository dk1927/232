import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    const messages = await prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
}
