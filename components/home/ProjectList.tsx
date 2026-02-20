"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowUpRight, Star, TrendingUp, Shield, Database, Server } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProjectData {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link: string | null;
    github: string | null;
    image: string | null;
    metadata: {
        difficulty?: number;
        impact?: string;
        type?: string;
    } | null;
}

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function ProjectList({ projects }: { projects: ProjectData[] }) {
    const [filter, setFilter] = useState("ALL");

    const filteredProjects = projects.filter(p => {
        if (filter === "ALL") return true;
        if (filter === "STRATEGIC") return p.metadata?.type === "Strategic";
        if (filter === "ERP") return p.metadata?.type === "ERP";
        if (filter === "INFRA") return p.metadata?.type === "Infrastructure";
        return true;
    });

    return (
        <section id="projects" className="py-24 md:py-32 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6"
                >
                    <div>
                        <h2 className="section-title">
                            프로젝트<span className="text-accent">.</span>
                        </h2>
                        <p className="section-subtitle">
                            비즈니스 임팩트를 창출한 주요 프로젝트입니다.
                        </p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "ALL", label: "All" },
                            { id: "STRATEGIC", label: "Strategy" },
                            { id: "ERP", label: "ERP/System" },
                            { id: "INFRA", label: "Infra" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setFilter(tab.id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === tab.id
                                        ? "bg-accent text-white shadow-md shadow-accent/25"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Project Cards */}
                <motion.div
                    key={filter} // Re-animate when filter changes
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {filteredProjects.map((project, index) => (
                        <motion.article
                            key={project.id}
                            variants={cardVariants}
                            className="glass-card-hover gradient-border overflow-hidden group flex flex-col relative"
                        >
                            {/* Strategic Badge */}
                            {project.metadata?.difficulty && project.metadata.difficulty >= 4 && (
                                <div className="absolute top-0 right-0 z-10">
                                    <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl border-l border-b border-amber-500/20 backdrop-blur-md flex items-center gap-1">
                                        <Star size={12} fill="currentColor" />
                                        STRATEGIC
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                {/* Header */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors leading-tight">
                                        {project.title}
                                    </h3>
                                    {project.metadata?.impact && (
                                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <TrendingUp size={14} className="text-emerald-500" />
                                            <span>Impact: <span className="text-slate-700 dark:text-slate-300">{project.metadata.impact}</span></span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
                                    {project.description}
                                </p>

                                {/* Metadata Grid */}
                                {project.metadata && (
                                    <div className="mt-4 py-3 border-t border-slate-100 dark:border-slate-800/50 grid grid-cols-2 gap-2">
                                        {project.metadata.difficulty && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Shield size={14} className="text-slate-400" />
                                                <span>난이도: </span>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={10}
                                                            className={i < (project.metadata?.difficulty || 0) ? "text-amber-400 fill-amber-400" : "text-slate-200 dark:text-slate-700"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {project.metadata.type && (
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                {project.metadata.type === 'Strategic' ? <Server size={14} /> : <Database size={14} />}
                                                <span>{project.metadata.type}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {project.tags.slice(0, 4).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 text-[11px] font-mono font-medium text-accent bg-accent/5 rounded-md border border-accent/10"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {project.tags.length > 4 && (
                                        <span className="px-2 py-1 text-[11px] font-mono text-slate-400">
                                            +{project.tags.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
