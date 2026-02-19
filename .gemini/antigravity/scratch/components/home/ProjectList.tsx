"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "@/data/projects";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectList() {
    return (
        <section id="projects" className="py-24 md:py-32 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">
                        프로젝트<span className="text-accent">.</span>
                    </h2>
                    <p className="section-subtitle">
                        직접 설계하고 구현한 프로젝트들을 소개합니다.
                    </p>
                </motion.div>

                {/* Project Cards */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                    {projects.map((project) => (
                        <motion.article
                            key={project.id}
                            variants={cardVariants}
                            className="glass-card p-6 hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {project.github && (
                                        <a
                                            href={project.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${project.title} GitHub`}
                                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <Github size={16} />
                                        </a>
                                    )}
                                    {project.link && (
                                        <a
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${project.title} Live`}
                                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                                {project.description}
                            </p>

                            {/* Tags */}
                            <div className="mt-5 flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 text-xs font-mono font-medium text-accent bg-accent/10 rounded-md"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
