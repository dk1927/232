"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star, TrendingUp, Shield, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function ProjectCard({ project, index }: { project: ProjectData; index: number }) {
    return (
        <motion.article
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

            {/* Image */}
            {project.image && (
                <div className="relative w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
            )}

            {/* Content */}
            <div className="p-6 flex flex-col flex-1">
                {/* Header */}
                <div className="mb-3">
                    <Link href={`/projects/${project.id}`}>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors leading-tight cursor-pointer">
                            {project.title}
                        </h3>
                    </Link>
                    {project.metadata?.impact && (
                        <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                            <TrendingUp size={14} className="text-emerald-500" />
                            <span>Impact: <span className="text-slate-700 dark:text-slate-300">{project.metadata.impact}</span></span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1 line-clamp-3">
                    {project.description}
                </p>

                {/* Metadata */}
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
                    </div>
                )}

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {project.tags.slice(0, 5).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-1 text-[11px] font-mono font-medium text-accent bg-accent/5 rounded-md border border-accent/10"
                        >
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 5 && (
                        <span className="px-2 py-1 text-[11px] font-mono text-slate-400">
                            +{project.tags.length - 5}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
                    <Link
                        href={`/projects/${project.id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                        자세히 보기 <ArrowRight size={14} />
                    </Link>
                    <div className="flex items-center gap-2">
                        {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                <Github size={16} />
                            </a>
                        )}
                        {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer"
                                className="p-2 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors">
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}
