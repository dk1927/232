import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth, requireAdmin, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    const skills = await prisma.skill.findMany({
        orderBy: [{ category: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(skills);
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

    return NextResponse.json(skill, { status: 201 });
}
