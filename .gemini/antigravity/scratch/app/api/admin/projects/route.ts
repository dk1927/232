import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { rateLimit, rateLimitResponse, logSecurityEvent } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const limit = parseInt(searchParams.get("limit") || "0");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};
    const conditions: Record<string, unknown>[] = [];

    if (search) {
        conditions.push(
            { title: { contains: search } },
            { description: { contains: search } }
        );
        where.OR = conditions;
    }

    if (page > 0 && limit > 0) {
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                orderBy: { order: "asc" },
                take: limit,
                skip: (page - 1) * limit,
            }),
            prisma.project.count({ where }),
        ]);
        return NextResponse.json({ projects, total, page, totalPages: Math.ceil(total / limit) });
    }

    const projects = await prisma.project.findMany({
        where,
        orderBy: { order: "asc" },
    });
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { allowed, retryAfterMs } = rateLimit(ip, "/api/admin/projects", { maxRequests: 20 });
    if (!allowed) {
        await logSecurityEvent(ip, "/api/admin/projects", "POST", 429);
        return rateLimitResponse(retryAfterMs);
    }

    const body = await request.json();
    const metadata = body.metadata ? JSON.stringify(body.metadata) : null;
    const project = await prisma.project.create({
        data: {
            title: body.title,
            description: body.description,
            tags: JSON.stringify(body.tags || []),
            link: body.link || null,
            github: body.github || null,
            image: body.image || null,
            order: body.order || 0,
            metadata,
            metaTitle: body.metaTitle || null,
            metaDescription: body.metaDescription || null,
            metaKeywords: body.metaKeywords || null,
        },
    });



    const user = await getCurrentUser();
    if (user) {
        await logAudit(user.id, "CREATE", "Project", project.id, null, {
            title: project.title,
            description: project.description,
        });
    }

    logger.info("Project created", { id: project.id, title: project.title, admin: user?.username });
    return NextResponse.json(project, { status: 201 });
}
