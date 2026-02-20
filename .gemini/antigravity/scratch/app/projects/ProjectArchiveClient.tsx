"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectCard from "@/components/projects/ProjectCard";

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

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08 },
    },
};

export default function ProjectArchiveClient({
    projects,
    types,
}: {
    projects: ProjectData[];
    types: string[];
}) {
    const [filter, setFilter] = useState("ALL");
    const [search, setSearch] = useState("");

    const filtered = projects.filter((p) => {
        const matchesFilter =
            filter === "ALL" || p.metadata?.type === filter;
        const matchesSearch =
            !search ||
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6">
                {/* Breadcrumb */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors mb-8"
                >
                    <ArrowLeft size={14} />
                    홈으로 돌아가기
                </Link>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="section-title">
                        프로젝트 아카이브<span className="text-accent">.</span>
                    </h1>
                    <p className="section-subtitle mt-3">
                        비즈니스 임팩트를 창출한 주요 프로젝트들을 한눈에 확인하세요.
                    </p>
                </motion.div>

                {/* Toolbar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                    {/* Search */}
                    <div className="relative flex-1 w-full sm:max-w-xs">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            placeholder="프로젝트 검색..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("ALL")}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === "ALL"
                                    ? "bg-accent text-white shadow-md shadow-accent/25"
                                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                }`}
                        >
                            All
                        </button>
                        {types.map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === type
                                        ? "bg-accent text-white shadow-md shadow-accent/25"
                                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Results Count */}
                <p className="mt-6 text-sm text-slate-400 dark:text-slate-500">
                    {filtered.length}개의 프로젝트
                </p>

                {/* Project Grid */}
                {filtered.length > 0 ? (
                    <motion.div
                        key={`${filter}-${search}`}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filtered.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                index={index}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <div className="mt-20 text-center">
                        <Filter
                            size={48}
                            className="mx-auto text-slate-300 dark:text-slate-700"
                        />
                        <p className="mt-4 text-slate-500 dark:text-slate-400">
                            조건에 맞는 프로젝트가 없습니다.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
