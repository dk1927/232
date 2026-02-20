import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
    const authError = await requireAuth();
    if (authError) return authError;

    const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });
    return NextResponse.json(settings);
}

export async function PUT(request: Request) {
    const authError = await requireAuth();
    if (authError) return authError;

    const body = await request.json();
    const settings = await prisma.siteSettings.upsert({
        where: { id: "settings" },
        update: {
            siteName: body.siteName,
            siteDescription: body.siteDescription,
            footerTagline: body.footerTagline,
            githubUrl: body.githubUrl,
            linkedinUrl: body.linkedinUrl,
            email: body.email,
        },
        create: {
            id: "settings",
            siteName: body.siteName,
            siteDescription: body.siteDescription,
            footerTagline: body.footerTagline,
            githubUrl: body.githubUrl,
            linkedinUrl: body.linkedinUrl,
            email: body.email,
        },
    });
    return NextResponse.json(settings);
}
