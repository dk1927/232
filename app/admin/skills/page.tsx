"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import { Plus, Pencil, Trash2, X, Save, Cpu } from "lucide-react";

interface Skill {
    id: string;
    name: string;
    category: string;
    level: number;
    icon: string;
    order: number;
}

const categories = ["Frontend", "Backend", "Tools", "Other"];
const emptySkill = { name: "", category: "Frontend", level: 80, icon: "", order: 0 };

export default function AdminSkillsPage() {
    const { toast } = useToast();
    const [skills, setSkills] = useState<Skill[]>([]);
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(emptySkill);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const fetchSkills = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/skills");
            if (!res.ok) throw new Error("Failed to fetch");
            const data = await res.json();
            setSkills(data);
        } catch {
            toast("스킬을 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const handleSave = async () => {
        if (!form.name.trim() || !form.icon.trim()) {
            toast("이름과 아이콘을 입력해주세요.", "error");
            return;
        }
        setSaving(true);
        try {
            const url = editing ? `/api/admin/skills/${editing}` : "/api/admin/skills";
            const method = editing ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Failed to save");
            toast(editing ? "스킬이 수정되었습니다." : "스킬이 추가되었습니다.");
            setEditing(null);
            setCreating(false);
            setForm(emptySkill);
            fetchSkills();
        } catch {
            toast("저장에 실패했습니다.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (skill: Skill) => {
        setCreating(false);
        setEditing(skill.id);
        setForm({ name: skill.name, category: skill.category, level: skill.level, icon: skill.icon, order: skill.order });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            toast("스킬이 삭제되었습니다.");
            fetchSkills();
        } catch {
            toast("삭제에 실패했습니다.", "error");
        }
    };

    const handleCancel = () => { setEditing(null); setCreating(false); setForm(emptySkill); };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                    </div>
                ))}
            </div>
        );
    }

    const groupedSkills = categories
        .map((cat) => ({ category: cat, items: skills.filter((s) => s.category === cat) }))
        .filter((g) => g.items.length > 0);

    const levelColor = (level: number) => {
        if (level >= 90) return "from-green-400 to-emerald-500";
        if (level >= 70) return "from-accent to-cyan-400";
        if (level >= 50) return "from-amber-400 to-orange-400";
        return "from-red-400 to-pink-400";
    };

    const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">스킬 관리</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">총 {skills.length}개 스킬</p>
                </div>
                <button onClick={() => { setEditing(null); setCreating(true); setForm(emptySkill); }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm">
                    <Plus size={16} /> 새 스킬
                </button>
            </div>

            {(creating || editing) && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-accent/20 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        {editing ? <Pencil size={18} className="text-accent" /> : <Plus size={18} className="text-accent" />}
                        {editing ? "스킬 수정" : "새 스킬"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">이름 *</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">카테고리</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass}>
                                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">아이콘 (이모지) *</label>
                            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="⚛️" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">정렬 순서</label>
                            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })} className={inputClass} />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                숙련도: <span className="text-accent font-bold">{form.level}%</span>
                            </label>
                            <input type="range" min={0} max={100} step={5} value={form.level}
                                onChange={(e) => setForm({ ...form, level: parseInt(e.target.value) })}
                                className="w-full accent-accent h-2 rounded-full" />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex gap-2">
                        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                            <Save size={16} /> {saving ? "저장 중..." : "저장"}
                        </button>
                        <button onClick={handleCancel} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <X size={16} /> 취소
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-8">
                {groupedSkills.map((group) => (
                    <div key={group.category}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-2">
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                            {group.category} ({group.items.length})
                            <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                        </h3>
                        <div className="space-y-2">
                            {group.items.map((skill) => (
                                <div key={skill.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-xl w-8 text-center">{skill.icon}</span>
                                        <span className="text-sm font-semibold text-slate-900 dark:text-white font-mono min-w-[80px]">{skill.name}</span>
                                        <div className="flex-1 max-w-xs h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full bg-gradient-to-r ${levelColor(skill.level)} rounded-full transition-all`} style={{ width: `${skill.level}%` }} />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 w-10 text-right">{skill.level}%</span>
                                    </div>
                                    <div className="flex items-center gap-1 ml-4">
                                        <button onClick={() => handleEdit(skill)} className="p-2 rounded-lg text-slate-400 hover:text-accent hover:bg-accent/10 transition-colors"><Pencil size={14} /></button>
                                        <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {skills.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <Cpu size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="mt-3 text-sm text-slate-400">등록된 스킬이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
