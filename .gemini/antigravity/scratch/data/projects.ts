export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link?: string;
    github?: string;
    image?: string;
}

export const projects: Project[] = [
    {
        id: "portfolio",
        title: "개인 포트폴리오 웹사이트",
        description:
            "Next.js 14, Tailwind CSS, TypeScript로 구축한 반응형 포트폴리오 사이트. 다크 모드, 애니메이션, SEO 최적화 적용.",
        tags: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
        link: "#",
        github: "https://github.com",
    },
    {
        id: "ai-chatbot",
        title: "AI 채팅 어시스턴트",
        description:
            "OpenAI API를 활용한 실시간 AI 대화 인터페이스. 스트리밍 응답 및 대화 히스토리 관리 기능 탑재.",
        tags: ["React", "Node.js", "OpenAI", "WebSocket"],
        link: "#",
        github: "https://github.com",
    },
    {
        id: "dashboard",
        title: "관리자 대시보드",
        description:
            "데이터 시각화 및 실시간 모니터링을 위한 관리 도구. 차트, 테이블, 필터링 등 다양한 위젯 제공.",
        tags: ["React", "TypeScript", "Recharts", "PostgreSQL"],
        link: "#",
        github: "https://github.com",
    },
    {
        id: "ecommerce",
        title: "이커머스 플랫폼",
        description:
            "풀스택 전자상거래 애플리케이션. 상품 관리, 장바구니, 결제 프로세스 구현.",
        tags: ["Next.js", "Prisma", "Stripe", "Tailwind CSS"],
        link: "#",
        github: "https://github.com",
    },
];
