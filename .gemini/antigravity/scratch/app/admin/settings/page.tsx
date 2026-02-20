"use client";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/admin/Toast";
import ImageUpload from "@/components/admin/ImageUpload";
import { Save, Lock, Sparkles, Globe, Eye, EyeOff } from "lucide-react";

export default function AdminSettingsPage() {
    const { toast } = useToast();
    const [tab, setTab] = useState<"hero" | "site" | "password" | "system">("hero");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Hero form
    const [hero, setHero] = useState({
        badge: "", titleLine1: "", titleLine2: "", titleSuffix: "",
        subtitle: "", ctaPrimary: "", ctaSecondary: "", profileImage: "",
    });

    // Site settings form
    const [site, setSite] = useState({
        siteName: "", siteDescription: "", footerTagline: "",
        githubUrl: "", linkedinUrl: "", email: "",
        maintenanceMode: false, maintenanceMessage: "",
    });

    // Password form
    const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [showPw, setShowPw] = useState(false);

    // ... (rest of imports and setup)



    // ...




    const fetchData = useCallback(async () => {
        try {
            const [heroRes, siteRes] = await Promise.all([
                fetch("/api/admin/hero"),
                fetch("/api/admin/settings"),
            ]);
            if (heroRes.ok) {
                const heroData = await heroRes.json();
                if (heroData) setHero(heroData);
            }
            if (siteRes.ok) {
                const siteData = await siteRes.json();
                if (siteData) setSite(siteData);
            }
        } catch {
            toast("설정을 불러오는데 실패했습니다.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const saveHero = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/hero", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hero),
            });
            if (!res.ok) throw new Error();
            toast("히어로 콘텐츠가 업데이트되었습니다.");
        } catch { toast("저장에 실패했습니다.", "error"); }
        finally { setSaving(false); }
    };

    const saveSite = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(site),
            });
            if (!res.ok) throw new Error();
            toast("사이트 설정이 업데이트되었습니다.");
        } catch { toast("저장에 실패했습니다.", "error"); }
        finally { setSaving(false); }
    };

    const changePassword = async () => {
        if (!pw.currentPassword || !pw.newPassword) {
            toast("비밀번호를 입력해주세요.", "error"); return;
        }
        if (pw.newPassword.length < 6) {
            toast("새 비밀번호는 6자 이상이어야 합니다.", "error"); return;
        }
        if (pw.newPassword !== pw.confirmPassword) {
            toast("새 비밀번호가 일치하지 않습니다.", "error"); return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/admin/password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast(data.error || "비밀번호 변경에 실패했습니다.", "error"); return;
            }
            toast("비밀번호가 성공적으로 변경되었습니다.");
            setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch { toast("비밀번호 변경에 실패했습니다.", "error"); }
        finally { setSaving(false); }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
                        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4" />
                        <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const inputClass = "w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all";
    const tabs = [
        { key: "hero" as const, label: "히어로 섹션", icon: Sparkles },
        { key: "site" as const, label: "사이트 설정", icon: Globe },
        { key: "system" as const, label: "시스템 점검", icon: Lock },
        { key: "password" as const, label: "비밀번호 변경", icon: Lock },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">설정</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">사이트 콘텐츠와 계정을 관리합니다.</p>

            {/* Tabs */}
            <div className="mt-6 flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
                {tabs.map((t) => {
                    const Icon = t.icon;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key
                                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                }`}
                        >
                            <Icon size={16} /> {t.label}
                        </button>
                    );
                })}
            </div>

            {/* Hero Tab */}
            {tab === "hero" && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">배지 텍스트</label>
                            <input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">제목 1줄</label>
                            <input value={hero.titleLine1} onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">제목 강조 (그라데이션)</label>
                            <input value={hero.titleLine2} onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">제목 접미사</label>
                            <input value={hero.titleSuffix} onChange={(e) => setHero({ ...hero, titleSuffix: e.target.value })} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">부제목 (줄바꿈: \n)</label>
                            <textarea rows={2} value={hero.subtitle} onChange={(e) => setHero({ ...hero, subtitle: e.target.value })} className={inputClass + " resize-none"} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CTA 메인 버튼</label>
                            <input value={hero.ctaPrimary} onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CTA 서브 버튼</label>
                            <input value={hero.ctaSecondary} onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <ImageUpload
                                value={hero.profileImage}
                                onChange={(url) => setHero({ ...hero, profileImage: url })}
                                label="프로필 이미지"
                            />
                        </div>
                    </div>
                    <button onClick={saveHero} disabled={saving} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <Save size={16} /> {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            )}

            {/* Site Tab */}
            {tab === "site" && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">사이트 이름</label>
                            <input value={site.siteName} onChange={(e) => setSite({ ...site, siteName: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">푸터 태그라인</label>
                            <input value={site.footerTagline} onChange={(e) => setSite({ ...site, footerTagline: e.target.value })} className={inputClass} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">사이트 설명</label>
                            <textarea rows={2} value={site.siteDescription} onChange={(e) => setSite({ ...site, siteDescription: e.target.value })} className={inputClass + " resize-none"} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">GitHub URL</label>
                            <input value={site.githubUrl} onChange={(e) => setSite({ ...site, githubUrl: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">LinkedIn URL</label>
                            <input value={site.linkedinUrl} onChange={(e) => setSite({ ...site, linkedinUrl: e.target.value })} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">이메일</label>
                            <input value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className={inputClass} />
                        </div>
                    </div>
                    <button onClick={saveSite} disabled={saving} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <Save size={16} /> {saving ? "저장 중..." : "저장"}
                    </button>
                </div>
            )}

            {/* System/Maintenance Tab */}
            {tab === "system" && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 border-l-4 border-l-red-500">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${site.maintenanceMode ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                        {site.maintenanceMode ? "시스템 점검 모드 활성화됨" : "정상 운영 중"}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
                        점검 모드를 켜면 관리자를 제외한 모든 사용자의 접근이 차단되고 점검 페이지가 표시됩니다. (Kill Switch)
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setSite({ ...site, maintenanceMode: !site.maintenanceMode })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${site.maintenanceMode ? "bg-red-500" : "bg-slate-200 dark:bg-slate-700"}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${site.maintenanceMode ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                            <label className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer" onClick={() => setSite({ ...site, maintenanceMode: !site.maintenanceMode })}>
                                긴급 점검 모드 (Kill Switch)
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">점검 안내 메시지</label>
                            <textarea
                                rows={3}
                                value={site.maintenanceMessage || ""}
                                onChange={(e) => setSite({ ...site, maintenanceMessage: e.target.value })}
                                className={inputClass + " resize-none"}
                                placeholder="현재 시스템 점검 중입니다..."
                            />
                        </div>
                    </div>

                    <button onClick={saveSite} disabled={saving} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50">
                        <Save size={16} /> 설정 저장
                    </button>
                </div>
            )}

            {/* Password Tab */}
            {tab === "password" && (
                <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 max-w-lg">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">현재 비밀번호</label>
                            <div className="relative">
                                <input
                                    type={showPw ? "text" : "password"} value={pw.currentPassword}
                                    onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
                                    className={inputClass} placeholder="현재 비밀번호"
                                />
                                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">새 비밀번호 (6자 이상)</label>
                            <input type={showPw ? "text" : "password"} value={pw.newPassword}
                                onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
                                className={inputClass} placeholder="새 비밀번호" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">새 비밀번호 확인</label>
                            <input type={showPw ? "text" : "password"} value={pw.confirmPassword}
                                onChange={(e) => setPw({ ...pw, confirmPassword: e.target.value })}
                                className={inputClass} placeholder="새 비밀번호 확인" />
                            {pw.confirmPassword && pw.newPassword !== pw.confirmPassword && (
                                <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>
                    </div>
                    <button onClick={changePassword} disabled={saving} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50">
                        <Lock size={16} /> {saving ? "변경 중..." : "비밀번호 변경"}
                    </button>
                </div>
            )}
        </div>
    );
}
