"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import { Users, Plus, Trash2, Shield, Eye, X } from "lucide-react";

interface UserData {
    id: string;
    username: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState({ username: "", password: "", role: "VIEWER" });
    const [saving, setSaving] = useState(false);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (!res.ok) throw new Error();
            setUsers(await res.json());
        } catch {
            toast("사용자 목록을 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleCreate = async () => {
        if (!form.username || !form.password) {
            toast("아이디와 비밀번호를 입력해주세요.", "error"); return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast(data.error || "생성에 실패했습니다.", "error"); return; }
            toast("사용자가 생성되었습니다.");
            setCreating(false);
            setForm({ username: "", password: "", role: "VIEWER" });
            fetchUsers();
        } catch {
            toast("생성에 실패했습니다.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) { toast(data.error || "삭제에 실패했습니다.", "error"); return; }
            toast("사용자가 삭제되었습니다.");
            fetchUsers();
        } catch {
            toast("삭제에 실패했습니다.", "error");
        }
    };

    const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">사용자 관리</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        총 {users.length}명의 사용자
                    </p>
                </div>
                <button
                    onClick={() => setCreating(!creating)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm"
                >
                    <Plus size={16} />
                    새 사용자
                </button>
            </div>

            {creating && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-accent/20 rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">새 사용자 추가</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">아이디</label>
                            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">비밀번호</label>
                            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="6자 이상" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">역할</label>
                            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
                                <option value="VIEWER">Viewer (읽기 전용)</option>
                                <option value="ADMIN">Admin (전체 권한)</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button onClick={handleCreate} disabled={saving} className="px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                            {saving ? "생성 중..." : "생성"}
                        </button>
                        <button onClick={() => setCreating(false)} className="px-5 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <X size={14} className="inline mr-1" /> 취소
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-6 space-y-3">
                {users.map((user) => (
                    <div key={user.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className={`p-2.5 rounded-xl ${user.role === "ADMIN" ? "bg-accent/10" : "bg-slate-100 dark:bg-slate-800"}`}>
                                {user.role === "ADMIN" ? <Shield size={20} className="text-accent" /> : <Eye size={20} className="text-slate-400" />}
                            </div>
                            <div>
                                <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${user.role === "ADMIN" ? "bg-accent/10 text-accent" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                                        {user.role}
                                    </span>
                                    <span className="text-xs text-slate-400">
                                        {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="삭제"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
