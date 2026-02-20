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

    const prev = await prisma.project.findUnique({ where: { id: params.id } });
    const body = await request.json();

    const project = await prisma.project.update({
        where: { id: params.id },
        data: {
            title: body.title,
            description: body.description,
            tags: JSON.stringify(body.tags || []),
            link: body.link || null,
            github: body.github || null,
            image: body.image || null,
            order: body.order ?? 0,
            metaTitle: body.metaTitle || null,
            metaDescription: body.metaDescription || null,
            metaKeywords: body.metaKeywords || null,
        },
    });

    const user = await getCurrentUser();
    if (user) {
        await logAudit(user.id, "UPDATE", "Project", params.id,
            prev ? { title: prev.title } : null,
            { title: project.title }
        );
    }

    return NextResponse.json(project);
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const prev = await prisma.project.findUnique({ where: { id: params.id } });
    await prisma.project.delete({ where: { id: params.id } });

    const user = await getCurrentUser();
    if (user) {
        await logAudit(user.id, "DELETE", "Project", params.id,
            prev ? { title: prev.title } : null,
            null
        );
    }

    return NextResponse.json({ success: true });
}
