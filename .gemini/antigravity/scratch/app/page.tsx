import { prisma } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import TechStack from "@/components/home/TechStack";
import ProjectList from "@/components/home/ProjectList";
import ContactForm from "@/components/home/ContactForm";

export const dynamic = "force-dynamic";

export default async function HomePage() {
    const [hero, projects, skills, settings, messageCount] = await Promise.all([
        prisma.heroContent.findUnique({ where: { id: "hero" } }),
        prisma.project.findMany({ orderBy: { order: "asc" } }),
        prisma.skill.findMany({ orderBy: { order: "asc" } }),
        prisma.siteSettings.findUnique({ where: { id: "settings" } }),
        prisma.contactMessage.count(),
    ]);

    const parsedProjects = projects.map((p: { id: string; title: string; description: string; tags: string; link: string | null; github: string | null; image: string | null }) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: JSON.parse(p.tags) as string[],
        link: p.link,
        github: p.github,
        image: p.image,
        metadata: p.metadata ? JSON.parse(p.metadata) : null,
    }));

    const categories: string[] = Array.from(new Set(skills.map((s: { category: string }) => s.category)));

    const stats = {
        projects: projects.length,
        skills: skills.length,
        messages: messageCount,
    };

    const contactInfo = settings
        ? {
            email: settings.email,
            githubUrl: settings.githubUrl,
            linkedinUrl: settings.linkedinUrl,
        }
        : undefined;

    return (
        <>
            <HeroSection hero={hero} stats={stats} />
            <TechStack skills={skills} categories={categories} />
            <ProjectList projects={parsedProjects} />
            <ContactForm contactInfo={contactInfo} />
        </>
    );
}
