"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import { FileText, ChevronLeft, ChevronRight, Filter } from "lucide-react";

interface AuditEntry {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    prevData: string | null;
    newData: string | null;
    createdAt: string;
    user: { username: string; role: string };
}

const actionColors: Record<string, string> = {
    CREATE: "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400",
    UPDATE: "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400",
};

export default function AdminAuditPage() {
    const { toast } = useToast();
    const [logs, setLogs] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [entityFilter, setEntityFilter] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (entityFilter) params.set("entity", entityFilter);
            const res = await fetch(`/api/admin/audit?${params}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setLogs(data.logs);
            setTotalPages(data.totalPages);
        } catch {
            toast("감사 로그를 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [page, entityFilter, toast]);

    useEffect(() => { fetchLogs(); }, [fetchLogs]);

    const entities = ["Project", "Skill", "User", "HeroContent", "SiteSettings"];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">감사 로그</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                모든 관리자 작업 기록을 추적합니다.
            </p>

            {/* Filters */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <button
                    onClick={() => { setEntityFilter(""); setPage(1); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!entityFilter ? "bg-accent text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                >
                    전체
                </button>
                {entities.map((e) => (
                    <button
                        key={e}
                        onClick={() => { setEntityFilter(e); setPage(1); }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${entityFilter === e ? "bg-accent text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                    >
                        {e}
                    </button>
                ))}
            </div>

            {/* Log List */}
            <div className="mt-6 space-y-2">
                {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 animate-pulse">
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                        </div>
                    ))
                ) : logs.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                        <p className="mt-3 text-sm text-slate-400">기록된 로그가 없습니다.</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div
                            key={log.id}
                            onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3 flex-wrap">
                                <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${actionColors[log.action] || "bg-slate-100 text-slate-600"}`}>
                                    {log.action}
                                </span>
                                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{log.entity}</span>
                                <span className="text-xs text-slate-400 font-mono">{log.entityId.slice(0, 8)}...</span>
                                <span className="ml-auto text-xs text-slate-400">
                                    {log.user.username} · {new Date(log.createdAt).toLocaleString("ko-KR")}
                                </span>
                            </div>
                            {expandedId === log.id && (
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    {log.prevData && (
                                        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/30">
                                            <p className="font-bold text-red-600 dark:text-red-400 mb-1">이전 데이터</p>
                                            <pre className="text-red-700 dark:text-red-300 whitespace-pre-wrap font-mono">
                                                {JSON.stringify(JSON.parse(log.prevData), null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                    {log.newData && (
                                        <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30">
                                            <p className="font-bold text-green-600 dark:text-green-400 mb-1">변경 데이터</p>
                                            <pre className="text-green-700 dark:text-green-300 whitespace-pre-wrap font-mono">
                                                {JSON.stringify(JSON.parse(log.newData), null, 2)}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {page} / {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
