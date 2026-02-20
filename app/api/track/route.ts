import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const ip = request.headers.get("x-forwarded-for") || "unknown";

        await prisma.pageView.create({
            data: {
                path: body.path || "/",
                referrer: body.referrer || null,
                userAgent: body.userAgent || null,
                ip,
            },
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Failed to track" }, { status: 500 });
    }
}
