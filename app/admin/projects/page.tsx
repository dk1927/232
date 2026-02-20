"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, X, Save, GripVertical, ExternalLink, Github, FolderKanban, ChevronDown } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    tags: string;
    link: string | null;
    github: string | null;
    image: string | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    order: number;
}

const emptyProject = {
    title: "",
    description: "",
    tags: "",
    link: "",
    github: "",
    image: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    order: 0,
};

export default function AdminProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<Project[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(emptyProject);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchProjects = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/projects");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setProjects(data);
        } catch {
            toast("프로젝트를 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleSave = async () => {
        if (!form.title.trim() || !form.description.trim()) {
            toast("제목과 설명을 입력해주세요.", "error");
            return;
        }
        setSaving(true);
        try {
            const body = {
                ...form,
                tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
            };
            const url = editing ? `/api/admin/projects/${editing}` : "/api/admin/projects";
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error("Failed to save");
            toast(editing ? "프로젝트가 수정되었습니다." : "프로젝트가 추가되었습니다.");
            setEditing(null);
            setCreating(false);
            setForm(emptyProject);
            fetchProjects();
        } catch {
            toast("저장에 실패했습니다.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project: Project) => {
        setCreating(false);
        setEditing(project.id);
        setForm({
            title: project.title,
            description: project.description,
            tags: JSON.parse(project.tags).join(", "),
            link: project.link || "",
            github: project.github || "",
            image: project.image || "",
            metaTitle: project.metaTitle || "",
            metaDescription: project.metaDescription || "",
            metaKeywords: project.metaKeywords || "",
            order: project.order,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast("프로젝트가 삭제되었습니다.");
            fetchProjects();
        } catch {
            toast("삭제에 실패했습니다.", "error");
        }
    };

    const handleCancel = () => {
        setEditing(null);
        setCreating(false);
        setForm(emptyProject);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
                        <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                ))}
            </div>
        );
    }

    const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">프로젝트 관리</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        총 {projects.length}개 프로젝트
                    </p>
                </div>
                <button
                    onClick={() => { setEditing(null); setCreating(true); setForm(emptyProject); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    새 프로젝트
                </button>
            </div>

            {/* Create / Edit Form */}
            {(creating || editing) && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-accent/20 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        {editing ? <Pencil size={18} className="text-accent" /> : <Plus size={18} className="text-accent" />}
                        {editing ? "프로젝트 수정" : "새 프로젝트"}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">제목 *</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="프로젝트 이름" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">태그 (쉼표 구분)</label>
                            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="React, TypeScript, Next.js" className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">설명 *</label>
                            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="프로젝트에 대한 설명..." className={inputClass + " resize-none"} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">라이브 링크</label>
                            <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub 링크</label>
                            <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} placeholder="https://github.com/..." className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">정렬 순서</label>
                            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <ImageUpload
                                value={form.image}
                                onChange={(url) => setForm({ ...form, image: url })}
                                label="프로젝트 이미지"
                            />
                        </div>
                        {/* SEO Section */}
                        <div className="md:col-span-2">
                            <details className="group">
                                <summary className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-2 mb-3">
                                    <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
                                    SEO 설정 (선택)
                                </summary>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-5 border-l-2 border-accent/20">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Meta Title</label>
                                        <input value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} placeholder="검색엔진에 표시될 제목" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Meta Keywords</label>
                                        <input value={form.metaKeywords} onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })} placeholder="키워드1, 키워드2, ..." className={inputClass} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Meta Description</label>
                                        <textarea rows={2} value={form.metaDescription} onChange={(e) => setForm({ ...form, metaDescription: e.target.value })} placeholder="검색엔진에 표시될 설명 (155자 이내 권장)" className={inputClass + " resize-none"} />
                                    </div>
                                </div>
                            </details>
                        </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                            <Save size={16} />
                            {saving ? "저장 중..." : "저장"}
                        </button>
                        <button onClick={handleCancel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <X size={16} />
                            취소
                        </button>
                    </div>
                </div>
            )}

            {/* Project List */}
            <div className="mt-6 space-y-3">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="flex items-center gap-2 text-slate-300 dark:text-slate-600 mt-1 shrink-0">
                                <GripVertical size={16} />
                                <span className="text-xs font-mono">#{index + 1}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                                    <div className="flex items-center gap-1 shrink-0">
                                        {project.link && (
                                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors">
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors">
                                                <Github size={14} />
                                            </a>
                                        )}
                                        <button onClick={() => handleEdit(project)} className="p-2 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{project.description}</p>
                                <div className="mt-2.5 flex flex-wrap gap-1.5">
                                    {JSON.parse(project.tags).map((tag: string) => (
                                        <span key={tag} className="px-2 py-0.5 text-xs font-mono text-accent bg-accent/10 rounded">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <FolderKanban size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="mt-3 text-sm text-slate-400">등록된 프로젝트가 없습니다.</p>
                        <button onClick={() => { setCreating(true); setForm(emptyProject); }} className="mt-3 text-sm text-accent hover:underline">
                            첫 프로젝트 추가하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
