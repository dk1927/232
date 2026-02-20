import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: "asc" },
        });

        const parsed = projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            tags: JSON.parse(p.tags) as string[],
            link: p.link,
            github: p.github,
            image: p.image,
            metadata: p.metadata ? JSON.parse(p.metadata) : null,
            createdAt: p.createdAt,
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        logger.error("Failed to fetch projects", { error });
        return NextResponse.json(
            { error: "프로젝트 목록을 불러오는데 실패했습니다." },
            { status: 500 }
        );
    }
}
