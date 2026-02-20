import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getCurrentUser } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const currentUser = await getCurrentUser();

    // Cannot delete yourself
    if (currentUser?.id === params.id) {
        return NextResponse.json({ error: "자기 자신은 삭제할 수 없습니다." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: params.id } });
    if (!user) {
        return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    await prisma.user.delete({ where: { id: params.id } });

    if (currentUser) {
        await logAudit(currentUser.id, "DELETE", "User", params.id, {
            username: user.username,
            role: user.role,
        }, null);
    }

    return NextResponse.json({ success: true });
}
