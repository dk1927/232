"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Star, TrendingUp, Shield, Calendar } from "lucide-react";
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
    createdAt: string;
}

export default function ProjectDetailClient({ project }: { project: ProjectData }) {
    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-4xl mx-auto px-6">
                {/* Breadcrumb */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft size={14} />
                    프로젝트 목록
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Strategic Badge */}
                    {project.metadata?.difficulty && project.metadata.difficulty >= 4 && (
                        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                            <Star size={12} fill="currentColor" />
                            STRATEGIC PROJECT
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {project.title}
                    </h1>

                    {/* Meta Row */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} />
                            {new Date(project.createdAt).toLocaleDateString("ko-KR", {
                                year: "numeric",
                                month: "long",
                            })}
                        </div>
                        {project.metadata?.type && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                                {project.metadata.type}
                            </span>
                        )}
                        {project.metadata?.impact && (
                            <div className="flex items-center gap-1.5">
                                <TrendingUp size={14} className="text-emerald-500" />
                                <span>{project.metadata.impact}</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Image */}
                {project.image && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="mt-8 relative w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                )}

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10"
                >
                    {/* Main Description */}
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            프로젝트 설명
                        </h2>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                {project.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Difficulty */}
                        {project.metadata?.difficulty && (
                            <div className="glass-card p-5">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <Shield size={16} className="text-slate-400" />
                                    난이도
                                </h3>
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={18}
                                            className={
                                                i < (project.metadata?.difficulty || 0)
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-slate-200 dark:text-slate-700"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tech Stack */}
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                                기술 스택
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 text-xs font-mono font-medium text-accent bg-accent/5 rounded-lg border border-accent/10"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="glass-card p-5 space-y-3">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                                링크
                            </h3>
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors w-full justify-center"
                                >
                                    <ExternalLink size={16} />
                                    라이브 데모
                                </a>
                            )}
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors w-full justify-center"
                                >
                                    <Github size={16} />
                                    소스 코드
                                </a>
                            )}
                            {!project.link && !project.github && (
                                <p className="text-sm text-slate-400 dark:text-slate-500">
                                    공개된 링크가 없습니다.
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
