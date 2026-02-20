import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, getCurrentUser } from "@/lib/auth";
import bcryptjs from "bcryptjs";
import { logAudit } from "@/lib/audit";

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const users = await prisma.user.findMany({
        select: { id: true, username: true, role: true, createdAt: true },
        orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(users);
}

export async function POST(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    if (!body.username || !body.password) {
        return NextResponse.json({ error: "아이디와 비밀번호를 입력해주세요." }, { status: 400 });
    }

    if (body.password.length < 6) {
        return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({ where: { username: body.username } });
    if (exists) {
        return NextResponse.json({ error: "이미 존재하는 아이디입니다." }, { status: 400 });
    }

    const hashedPassword = await bcryptjs.hash(body.password, 12);
    const user = await prisma.user.create({
        data: {
            username: body.username,
            password: hashedPassword,
            role: body.role || "VIEWER",
        },
    });

    const currentUser = await getCurrentUser();
    if (currentUser) {
        await logAudit(currentUser.id, "CREATE", "User", user.id, null, {
            username: user.username,
            role: user.role,
        });
    }

    return NextResponse.json(
        { id: user.id, username: user.username, role: user.role },
        { status: 201 }
    );
}
