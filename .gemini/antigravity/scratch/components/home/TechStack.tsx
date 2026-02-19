"use client";

import { motion } from "framer-motion";
import { skills, skillCategories } from "@/data/skills";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

function SkillBar({ name, level, icon }: { name: string; level: number; icon: string }) {
    return (
        <motion.div
            variants={itemVariants}
            className="glass-card p-4 hover:border-accent/30 transition-all group"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <span className="text-lg">{icon}</span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 font-mono">
                        {name}
                    </span>
                </div>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 group-hover:text-accent transition-colors">
                    {level}%
                </span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400"
                />
            </div>
        </motion.div>
    );
}

export default function TechStack() {
    return (
        <section id="skills" className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">
                        기술 스택<span className="text-accent">.</span>
                    </h2>
                    <p className="section-subtitle">
                        주로 사용하는 기술과 도구들입니다. 끊임없이 학습하며 성장합니다.
                    </p>
                </motion.div>

                {/* Skills by Category */}
                <div className="mt-14 space-y-12">
                    {skillCategories.map((category) => (
                        <div key={category}>
                            <motion.h3
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4"
                            >
                                {category}
                            </motion.h3>
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
                            >
                                {skills
                                    .filter((s) => s.category === category)
                                    .map((skill) => (
                                        <SkillBar
                                            key={skill.name}
                                            name={skill.name}
                                            level={skill.level}
                                            icon={skill.icon}
                                        />
                                    ))}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
