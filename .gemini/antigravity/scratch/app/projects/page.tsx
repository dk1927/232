import { prisma } from "@/lib/db";
import ProjectArchiveClient from "./ProjectArchiveClient";

export const metadata = {
    title: "프로젝트 아카이브 | Portfolio",
    description: "비즈니스 임팩트를 창출한 주요 프로젝트 아카이브입니다.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
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
        createdAt: p.createdAt.toISOString(),
    }));

    // Extract unique types for filter
    const types: string[] = Array.from(
        new Set(parsed.map((p) => p.metadata?.type).filter(Boolean))
    );

    return <ProjectArchiveClient projects={parsed} types={types} />;
}
