import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
    const authError = await requireAuth();
    if (authError) return authError;

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "20")); // Default 20 for skills
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (search) {
        where.OR = [
            { name: { contains: search } },
            { category: { contains: search } },
        ];
    }
    if (category && category !== "ALL") {
        where.category = category;
    }

    const [skills, total, allCategories] = await Promise.all([
        prisma.skill.findMany({
            where,
            orderBy: [{ category: "asc" }, { order: "asc" }],
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.skill.count({ where }),
        prisma.skill.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } }),
    ]);

    return NextResponse.json({
        data: skills,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            allCategories: allCategories.map((c: { category: string }) => c.category),
        },
    });
}

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const skill = await prisma.skill.create({
        data: {
            name: body.name,
            category: body.category,
            level: body.level,
            icon: body.icon,
            order: body.order || 0,
        },
    });



    const user = await getCurrentUser();
    if (user) await logAudit(user.id, "CREATE", "Skill", skill.id, null, { name: skill.name });

    logger.info("Skill created", { id: skill.id, name: skill.name, admin: user?.username });

    return NextResponse.json(skill, { status: 201 });
}
