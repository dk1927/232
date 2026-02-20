import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
    const authError = await requireAdmin();
    if (authError) return authError;

    const config = await prisma.webhookConfig.findUnique({ where: { id: "webhooks" } });
    return NextResponse.json(config || {
        slackUrl: "", emailTo: "", emailHost: "", emailPort: 587,
        emailUser: "", emailPass: "", enabled: false,
    });
}

export async function PUT(request: Request) {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const config = await prisma.webhookConfig.upsert({
        where: { id: "webhooks" },
        update: {
            slackUrl: body.slackUrl || "",
            emailTo: body.emailTo || "",
            emailHost: body.emailHost || "",
            emailPort: body.emailPort || 587,
            emailUser: body.emailUser || "",
            emailPass: body.emailPass || "",
            enabled: body.enabled ?? false,
        },
        create: {
            id: "webhooks",
            slackUrl: body.slackUrl || "",
            emailTo: body.emailTo || "",
            emailHost: body.emailHost || "",
            emailPort: body.emailPort || 587,
            emailUser: body.emailUser || "",
            emailPass: body.emailPass || "",
            enabled: body.enabled ?? false,
        },
    });

    return NextResponse.json(config);
}
