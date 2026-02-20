import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { title: "프로젝트를 찾을 수 없습니다" };
    return {
        title: `${project.title} | Portfolio`,
        description: project.metaDescription || project.description,
        keywords: project.metaKeywords || undefined,
    };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });

    if (!project) notFound();

    const parsed = {
        id: project.id,
        title: project.title,
        description: project.description,
        tags: JSON.parse(project.tags) as string[],
        link: project.link,
        github: project.github,
        image: project.image,
        metadata: project.metadata ? JSON.parse(project.metadata) : null,
        createdAt: project.createdAt.toISOString(),
    };

    return <ProjectDetailClient project={parsed} />;
}
