"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import { Trash2, Eye, ChevronDown, ChevronUp, Mail, Clock, Search, Filter, User } from "lucide-react";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AdminMessagesPage() {
    const { toast } = useToast();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
    const [search, setSearch] = useState("");

    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/messages");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setMessages(data);
        } catch {
            toast("메시지를 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ read: true }),
            });
            if (!res.ok) throw new Error();
            toast("읽음 처리되었습니다.");
            fetchMessages();
        } catch { toast("처리에 실패했습니다.", "error"); }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        try {
            const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast("메시지가 삭제되었습니다.");
            setExpandedId(null);
            fetchMessages();
        } catch { toast("삭제에 실패했습니다.", "error"); }
    };

    const filteredMessages = messages
        .filter((m) => {
            if (filter === "unread") return !m.read;
            if (filter === "read") return m.read;
            return true;
        })
        .filter((m) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q);
        });

    const unreadCount = messages.filter((m) => !m.read).length;

    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700" />
                            <div className="flex-1">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
                                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        문의 메시지
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-accent rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">총 {messages.length}개 메시지</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="이름, 이메일, 메시지 검색..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    {([
                        { key: "all" as const, label: "전체" },
                        { key: "unread" as const, label: `안 읽음 (${unreadCount})` },
                        { key: "read" as const, label: "읽음" },
                    ]).map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f.key
                                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Messages List */}
            <div className="mt-4 space-y-2">
                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`bg-white dark:bg-slate-900 border rounded-xl transition-all ${!msg.read
                                ? "border-accent/20 shadow-sm"
                                : "border-slate-200 dark:border-slate-800"
                            }`}
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                            className="w-full p-4 flex items-center gap-3 text-left"
                        >
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${!msg.read ? "bg-accent/10 text-accent" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                                }`}>
                                {msg.name.charAt(0)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{msg.name}</span>
                                    {!msg.read && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                                </div>
                                <p className="text-xs text-slate-400 truncate">{msg.message}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(msg.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                </span>
                                {expandedId === msg.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                            </div>
                        </button>

                        {/* Expanded Content */}
                        {expandedId === msg.id && (
                            <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                    <User size={12} /> <span>{msg.name}</span>
                                    <span className="text-slate-300 dark:text-slate-600">|</span>
                                    <Mail size={12} />
                                    <a href={`mailto:${msg.email}`} className="text-accent hover:underline">{msg.email}</a>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {msg.message}
                                </div>
                                <div className="mt-3 flex gap-2">
                                    {!msg.read && (
                                        <button onClick={() => markAsRead(msg.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors">
                                            <Eye size={12} /> 읽음 처리
                                        </button>
                                    )}
                                    <button onClick={() => deleteMessage(msg.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors">
                                        <Trash2 size={12} /> 삭제
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {filteredMessages.length === 0 && (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        {search || filter !== "all" ? (
                            <>
                                <Filter size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                                <p className="mt-3 text-sm text-slate-400">검색 결과가 없습니다.</p>
                            </>
                        ) : (
                            <>
                                <Mail size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
                                <p className="mt-3 text-sm text-slate-400">받은 메시지가 없습니다.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
