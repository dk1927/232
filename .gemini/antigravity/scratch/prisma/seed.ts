import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // 1. Admin user
    const hashedPassword = await bcryptjs.hash("admin1234", 12);
    await prisma.user.upsert({
        where: { username: "admin" },
        update: {},
        create: {
            username: "admin",
            password: hashedPassword,
        },
    });
    console.log("✅ Admin user created (admin / admin1234)");

    // 2. Hero content
    await prisma.heroContent.upsert({
        where: { id: "hero" },
        update: {},
        create: {
            id: "hero",
            badge: "Open to opportunities",
            titleLine1: "안녕하세요,",
            titleLine2: "개발자",
            titleSuffix: "입니다.",
            subtitle:
                "사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.\n깔끔한 코드와 아름다운 인터페이스를 만들어 갑니다.",
            ctaPrimary: "프로젝트 보기",
            ctaSecondary: "연락하기",
        },
    });
    console.log("✅ Hero content created");

    // 3. Site settings
    await prisma.siteSettings.upsert({
        where: { id: "settings" },
        update: {},
        create: {
            id: "settings",
            siteName: "Portfolio",
            siteDescription:
                "프론트엔드 개발자 포트폴리오 - React, Next.js, TypeScript 전문",
            footerTagline: "Minimalist Tech Professional",
            githubUrl: "https://github.com",
            linkedinUrl: "https://linkedin.com",
            email: "hello@example.com",
        },
    });
    console.log("✅ Site settings created");

    // 4. Projects
    const projects = [
        {
            title: "개인 포트폴리오 웹사이트",
            description:
                "Next.js 14, Tailwind CSS, TypeScript로 구축한 반응형 포트폴리오 사이트. 다크 모드, 애니메이션, SEO 최적화 적용.",
            tags: JSON.stringify(["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"]),
            link: "#",
            github: "https://github.com",
            order: 0,
        },
        {
            title: "AI 채팅 어시스턴트",
            description:
                "OpenAI API를 활용한 실시간 AI 대화 인터페이스. 스트리밍 응답 및 대화 히스토리 관리 기능 탑재.",
            tags: JSON.stringify(["React", "Node.js", "OpenAI", "WebSocket"]),
            link: "#",
            github: "https://github.com",
            order: 1,
        },
        {
            title: "관리자 대시보드",
            description:
                "데이터 시각화 및 실시간 모니터링을 위한 관리 도구. 차트, 테이블, 필터링 등 다양한 위젯 제공.",
            tags: JSON.stringify(["React", "TypeScript", "Recharts", "PostgreSQL"]),
            link: "#",
            github: "https://github.com",
            order: 2,
        },
        {
            title: "이커머스 플랫폼",
            description:
                "풀스택 전자상거래 애플리케이션. 상품 관리, 장바구니, 결제 프로세스 구현.",
            tags: JSON.stringify(["Next.js", "Prisma", "Stripe", "Tailwind CSS"]),
            link: "#",
            github: "https://github.com",
            order: 3,
        },
    ];

    for (const project of projects) {
        await prisma.project.create({ data: project });
    }
    console.log("✅ Projects created (" + projects.length + ")");

    // 5. Skills
    const skills = [
        { name: "React", category: "Frontend", level: 90, icon: "⚛️", order: 0 },
        { name: "Next.js", category: "Frontend", level: 85, icon: "▲", order: 1 },
        { name: "TypeScript", category: "Frontend", level: 88, icon: "🔷", order: 2 },
        { name: "Tailwind CSS", category: "Frontend", level: 92, icon: "🎨", order: 3 },
        { name: "HTML/CSS", category: "Frontend", level: 95, icon: "🌐", order: 4 },
        { name: "JavaScript", category: "Frontend", level: 90, icon: "💛", order: 5 },
        { name: "Node.js", category: "Backend", level: 80, icon: "🟢", order: 0 },
        { name: "Python", category: "Backend", level: 75, icon: "🐍", order: 1 },
        { name: "PostgreSQL", category: "Backend", level: 70, icon: "🐘", order: 2 },
        { name: "Git", category: "Tools", level: 88, icon: "🔀", order: 0 },
        { name: "Docker", category: "Tools", level: 65, icon: "🐳", order: 1 },
        { name: "Vercel", category: "Tools", level: 85, icon: "🚀", order: 2 },
    ];

    for (const skill of skills) {
        await prisma.skill.create({ data: skill });
    }
    console.log("✅ Skills created (" + skills.length + ")");

    console.log("\n🎉 Seed completed successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
