
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const newSkills = [
    // 1. Digital Transformation & PLM
    { name: "Teamcenter (PLM)", category: "DX & Smart Factory", level: 90, icon: "🏭", order: 1 },
    { name: "Solid Edge (CAD)", category: "DX & Smart Factory", level: 85, icon: "📐", order: 2 },
    { name: "Smart Factory", category: "DX & Smart Factory", level: 90, icon: "🤖", order: 3 },
    { name: "Manufacturing IT", category: "DX & Smart Factory", level: 95, icon: "⚙️", order: 4 },

    // 2. DevOps & Infrastructure
    { name: "Gitea & Git", category: "DevOps", level: 85, icon: "�", order: 5 },
    { name: "Docker", category: "DevOps", level: 80, icon: "🐳", order: 6 },
    { name: "Synology NAS", category: "Infrastructure", level: 90, icon: "☁️", order: 7 },
    { name: "Virtualization", category: "Infrastructure", level: 85, icon: "🖥️", order: 8 },
    { name: "Windows Server (2012-2022)", category: "Infrastructure", level: 95, icon: "🪟", order: 9 },
    { name: "Cisco Network", category: "Infrastructure", level: 80, icon: "🌐", order: 10 },

    // 3. Database & ERP
    { name: "MSSQL (2012-2022)", category: "Database", level: 95, icon: "🗄️", order: 11 },
    { name: "Stored Procedures", category: "Database", level: 95, icon: "⚡", order: 12 },
    { name: "Query Optimization", category: "Database", level: 90, icon: "🚀", order: 13 },
    { name: "ERP (UNIERP)", category: "Backend", level: 90, icon: "�", order: 14 },
    { name: "Groupware", category: "Backend", level: 85, icon: "�", order: 15 },

    // 4. Security & Compliance
    { name: "Disaster Recovery (DR)", category: "Security", level: 85, icon: "�", order: 16 },
    { name: "DLP & Security", category: "Security", level: 85, icon: "�", order: 17 },
    { name: "IT Governance", category: "Security", level: 85, icon: "�", order: 18 },

    // 5. Development
    { name: "Python", category: "Development", level: 85, icon: "🐍", order: 19 },
    { name: "C# (.NET)", category: "Development", level: 80, icon: "#️⃣", order: 20 },
    { name: "Web Development", category: "Development", level: 80, icon: "🌍", order: 21 },
];

async function main() {
    console.log("Deleting existing skills...");
    await prisma.skill.deleteMany({});

    console.log("Inserting new skills...");
    for (const skill of newSkills) {
        await prisma.skill.create({
            data: {
                ...skill,
                locale: "ko",
            },
        });
    }

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
