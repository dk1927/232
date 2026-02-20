import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import bcryptjs from "bcryptjs";

export async function PUT(request: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

    const body = await request.json();

    if (!body.currentPassword || !body.newPassword) {
        return NextResponse.json(
            { error: "현재 비밀번호와 새 비밀번호를 입력해주세요." },
            { status: 400 }
        );
    }

    if (body.newPassword.length < 6) {
        return NextResponse.json(
            { error: "새 비밀번호는 6자 이상이어야 합니다." },
            { status: 400 }
        );
    }

    const user = await prisma.user.findFirst();
    if (!user) {
        return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });
    }

    const isValid = await bcryptjs.compare(body.currentPassword, user.password);
    if (!isValid) {
        return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 401 });
    }

    const hashedPassword = await bcryptjs.hash(body.newPassword, 12);
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true });
}
