import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10"));
    const search = searchParams.get("search") || "";
    const filter = searchParams.get("filter") || "all"; // all, unread, read

    const where: any = {};

    if (search) {
        where.OR = [
            { name: { contains: search } },
            { email: { contains: search } },
            { message: { contains: search } },
        ];
    }

    if (filter === "unread") {
        where.read = false;
    } else if (filter === "read") {
        where.read = true;
    }

    const [messages, total] = await Promise.all([
        prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.contactMessage.count({ where }),
    ]);

    return NextResponse.json({
        data: messages,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    });
}
