import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    const hero = await prisma.heroContent.findUnique({ where: { id: "hero" } });
    return NextResponse.json(hero);
}

export async function PUT(request: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

    const body = await request.json();
    const hero = await prisma.heroContent.upsert({
        where: { id: "hero" },
        update: {
            badge: body.badge,
            titleLine1: body.titleLine1,
            titleLine2: body.titleLine2,
            titleSuffix: body.titleSuffix,
            subtitle: body.subtitle,
            ctaPrimary: body.ctaPrimary,
            ctaSecondary: body.ctaSecondary,
            profileImage: body.profileImage || null,
        },
        create: {
            id: "hero",
            badge: body.badge,
            titleLine1: body.titleLine1,
            titleLine2: body.titleLine2,
            titleSuffix: body.titleSuffix,
            subtitle: body.subtitle,
            ctaPrimary: body.ctaPrimary,
            ctaSecondary: body.ctaSecondary,
            profileImage: body.profileImage || null,
        },
    });
    return NextResponse.json(hero);
}
