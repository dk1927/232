
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.heroContent.upsert({
        where: { id: "hero" },
        update: {
            subtitle: "전사적 디지털 전환(DX)과 안정적인 운영을 주도하는 엔지니어입니다.\n비즈니스 가치를 창출하는 기술 전략을 설계하고 실행합니다.",
            badge: "Strategic IT Professional",
        },
        create: {
            id: "hero",
            subtitle: "전사적 디지털 전환(DX)과 안정적인 운영을 주도하는 엔지니어입니다.\n비즈니스 가치를 창출하는 기술 전략을 설계하고 실행합니다.",
            badge: "Strategic IT Professional",
        },
    });
    console.log("Hero content updated.");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
