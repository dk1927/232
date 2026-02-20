"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface SkillData {
    id: string;
    name: string;
    category: string;
    level: number;
    icon: string;
    order: number;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.04,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

function SkillCard({ name, level, icon }: { name: string; level: number; icon: string }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
        card.style.transform = `perspective(500px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (card) card.style.transform = "perspective(500px) rotateY(0) rotateX(0) scale(1)";
    };

    const levelColor = level >= 90
        ? "from-emerald-400 to-green-500"
        : level >= 70
            ? "from-accent to-cyan-400"
            : level >= 50
                ? "from-amber-400 to-orange-400"
                : "from-rose-400 to-pink-400";

    return (
        <motion.div
            ref={cardRef}
            variants={itemVariants}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="glass-card-hover p-5 cursor-default gradient-border group"
            style={{ transition: "transform 0.15s ease-out" }}
        >
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-mono truncate">
                        {name}
                    </p>
                </div>
                <span className="text-xs font-mono font-bold text-accent tabular-nums">
                    {level}%
                </span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className={`h-full rounded-full bg-gradient-to-r ${levelColor}`}
                />
            </div>
        </motion.div>
    );
}

export default function TechStack({ skills, categories }: { skills: SkillData[]; categories: string[] }) {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filteredSkills = activeCategory
        ? skills.filter((s) => s.category === activeCategory)
        : skills;

    const displayCategories = activeCategory ? [activeCategory] : categories;

    return (
        <section id="skills" className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
                >
                    <div>
                        <h2 className="section-title">
                            기술 스택<span className="text-accent">.</span>
                        </h2>
                        <p className="section-subtitle">
                            주로 사용하는 기술과 도구들입니다. 끊임없이 학습하며 성장합니다.
                        </p>
                    </div>
                    <p className="text-sm text-slate-400 dark:text-slate-500 font-mono shrink-0">
                        총 <span className="text-accent font-bold">{skills.length}</span>개 기술
                    </p>
                </motion.div>

                {/* Category Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mt-8 flex flex-wrap gap-2"
                >
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === null
                                ? "bg-accent text-white shadow-md shadow-accent/25"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                    >
                        전체
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-accent text-white shadow-md shadow-accent/25"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            {cat}
                            <span className="ml-1.5 text-xs opacity-70">
                                {skills.filter((s) => s.category === cat).length}
                            </span>
                        </button>
                    ))}
                </motion.div>

                {/* Skills by Category */}
                <div className="mt-10 space-y-10">
                    {displayCategories.map((category) => {
                        const categorySkills = filteredSkills.filter((s) => s.category === category);
                        if (categorySkills.length === 0) return null;
                        return (
                            <div key={category}>
                                {!activeCategory && (
                                    <motion.h3
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                        className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-3"
                                    >
                                        <span>{category}</span>
                                        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                                    </motion.h3>
                                )}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                                >
                                    {categorySkills.map((skill) => (
                                        <SkillCard
                                            key={skill.id}
                                            name={skill.name}
                                            level={skill.level}
                                            icon={skill.icon}
                                        />
                                    ))}
                                </motion.div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
