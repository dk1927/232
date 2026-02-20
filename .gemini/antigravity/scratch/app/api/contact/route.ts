import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { notifyNewContact } from "@/lib/webhook";

export async function POST(request: Request) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed, retryAfterMs } = rateLimit(ip, "/api/contact", { maxRequests: 5, windowMs: 60_000 });
    if (!allowed) return rateLimitResponse(retryAfterMs);

    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
        return NextResponse.json(
            { error: "모든 필드를 입력해주세요." },
            { status: 400 }
        );
    }

    const message = await prisma.contactMessage.create({
        data: {
            name: body.name,
            email: body.email,
            message: body.message,
        },
    });

    // Send webhook notifications (async, non-blocking)
    notifyNewContact({ name: body.name, email: body.email, message: body.message }).catch(() => { });

    return NextResponse.json(
        { success: true, id: message.id },
        { status: 201 }
    );
}
