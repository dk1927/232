import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const prev = await prisma.skill.findUnique({ where: { id: params.id } });
    const body = await request.json();
    const skill = await prisma.skill.update({
        where: { id: params.id },
        data: {
            name: body.name,
            category: body.category,
            level: body.level,
            icon: body.icon,
            order: body.order ?? 0,
        },
    });

    const user = await getCurrentUser();
    if (user) await logAudit(user.id, "UPDATE", "Skill", params.id, prev ? { name: prev.name } : null, { name: skill.name });

    return NextResponse.json(skill);
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const prev = await prisma.skill.findUnique({ where: { id: params.id } });
    await prisma.skill.delete({ where: { id: params.id } });

    const user = await getCurrentUser();
    if (user) await logAudit(user.id, "DELETE", "Skill", params.id, prev ? { name: prev.name } : null, null);

    return NextResponse.json({ success: true });
}
