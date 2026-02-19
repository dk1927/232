export interface Skill {
    name: string;
    category: string;
    level: number; // 0-100
    icon: string; // lucide icon name or emoji
}

export const skills: Skill[] = [
    // Frontend
    { name: "React", category: "Frontend", level: 90, icon: "⚛️" },
    { name: "Next.js", category: "Frontend", level: 85, icon: "▲" },
    { name: "TypeScript", category: "Frontend", level: 88, icon: "🔷" },
    { name: "Tailwind CSS", category: "Frontend", level: 92, icon: "🎨" },
    { name: "HTML/CSS", category: "Frontend", level: 95, icon: "🌐" },
    { name: "JavaScript", category: "Frontend", level: 90, icon: "💛" },

    // Backend
    { name: "Node.js", category: "Backend", level: 80, icon: "🟢" },
    { name: "Python", category: "Backend", level: 75, icon: "🐍" },
    { name: "PostgreSQL", category: "Backend", level: 70, icon: "🐘" },

    // Tools & DevOps
    { name: "Git", category: "Tools", level: 88, icon: "🔀" },
    { name: "Docker", category: "Tools", level: 65, icon: "🐳" },
    { name: "Vercel", category: "Tools", level: 85, icon: "🚀" },
];

export const skillCategories = ["Frontend", "Backend", "Tools"] as const;
