"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import { Webhook, Save, TestTube } from "lucide-react";

export default function WebhookSettingsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        slackUrl: "",
        emailTo: "",
        emailHost: "",
        emailPort: 587,
        emailUser: "",
        emailPass: "",
        enabled: false,
    });

    const fetchConfig = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/webhooks");
            if (!res.ok) throw new Error();
            const data = await res.json();
            setForm({
                slackUrl: data.slackUrl || "",
                emailTo: data.emailTo || "",
                emailHost: data.emailHost || "",
                emailPort: data.emailPort || 587,
                emailUser: data.emailUser || "",
                emailPass: data.emailPass || "",
                enabled: data.enabled || false,
            });
        } catch {
            toast("웹훅 설정을 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchConfig(); }, [fetchConfig]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/webhooks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error();
            toast("웹훅 설정이 저장되었습니다.");
        } catch {
            toast("저장에 실패했습니다.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleTest = async () => {
        const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "테스트 사용자",
                email: "test@example.com",
                message: "웹훅 테스트 메시지입니다.",
            }),
        });
        if (res.ok) toast("테스트 메시지가 전송되었습니다. 알림을 확인해주세요.");
        else toast("테스트 전송에 실패했습니다.", "error");
    };

    const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";

    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <Webhook size={24} className="text-accent" />
                        웹훅 알림 설정
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        새 문의가 도착하면 Slack이나 이메일로 알림을 받습니다.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={handleTest} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <TestTube size={16} />
                        테스트
                    </button>
                    <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <Save size={16} />
                        {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>

            {/* Enable Toggle */}
            <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <label className="flex items-center justify-between cursor-pointer">
                    <div>
                        <p className="font-semibold text-slate-900 dark:text-white">알림 활성화</p>
                        <p className="text-xs text-slate-500 mt-0.5">새 문의 도착 시 알림을 전송합니다.</p>
                    </div>
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={form.enabled}
                            onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                            className="sr-only"
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${form.enabled ? "bg-accent" : "bg-slate-300 dark:bg-slate-600"}`}>
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.enabled ? "translate-x-5.5" : "translate-x-0.5"} mt-0.5`} />
                        </div>
                    </div>
                </label>
            </div>

            {/* Slack */}
            <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">🔔 Slack Webhook</h2>
                <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">Webhook URL</label>
                    <input value={form.slackUrl} onChange={(e) => setForm({ ...form, slackUrl: e.target.value })} placeholder="https://hooks.slack.com/services/..." className={inputClass} />
                    <p className="text-xs text-slate-400 mt-1.5">Slack Incoming Webhooks에서 URL을 생성하세요.</p>
                </div>
            </div>

            {/* Email */}
            <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">📧 이메일 알림</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">수신 이메일</label>
                        <input value={form.emailTo} onChange={(e) => setForm({ ...form, emailTo: e.target.value })} placeholder="admin@example.com" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">SMTP Host</label>
                        <input value={form.emailHost} onChange={(e) => setForm({ ...form, emailHost: e.target.value })} placeholder="smtp.gmail.com" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">SMTP Port</label>
                        <input type="number" value={form.emailPort} onChange={(e) => setForm({ ...form, emailPort: parseInt(e.target.value) || 587 })} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">SMTP User</label>
                        <input value={form.emailUser} onChange={(e) => setForm({ ...form, emailUser: e.target.value })} placeholder="user@gmail.com" className={inputClass} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">SMTP Password</label>
                        <input type="password" value={form.emailPass} onChange={(e) => setForm({ ...form, emailPass: e.target.value })} placeholder="앱 비밀번호" className={inputClass} />
                    </div>
                </div>
            </div>
        </div>
    );
}
