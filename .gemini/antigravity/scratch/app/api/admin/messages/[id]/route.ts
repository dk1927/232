import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAuth();
    if (authError) return authError;

    const message = await prisma.contactMessage.update({
        where: { id: params.id },
        data: { read: true },
    });
    return NextResponse.json(message);
}

export async function DELETE(
    _request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAuth();
    if (authError) return authError;

    await prisma.contactMessage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
