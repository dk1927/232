
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const projectCount = await prisma.project.count();
    const skillCount = await prisma.skill.count();

    console.log(`Total Projects: ${projectCount}`);
    console.log(`Total Skills: ${skillCount}`);

    const projects = await prisma.project.findMany({
        take: 3,
        orderBy: { order: "asc" },
        select: { title: true, tags: true },
    });

    console.log("\nSome Projects:");
    projects.forEach((p) => {
        console.log(`- ${p.title} (${p.tags})`);
    });

    const skills = await prisma.skill.findMany({
        take: 5,
        orderBy: { order: "asc" },
        select: { name: true, category: true },
    });

    console.log("\nSome Skills:");
    skills.forEach((s) => {
        console.log(`- ${s.name} [${s.category}]`);
    });
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
