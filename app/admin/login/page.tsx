"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("아이디 또는 비밀번호가 올바르지 않습니다.");
            setLoading(false);
        } else {
            router.push("/admin");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/3 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 -right-32 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-sm mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-5">
                        <Lock size={28} className="text-accent" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Portfolio<span className="text-accent">.</span>
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                        <Sparkles size={12} />
                        관리자 로그인
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                            아이디
                        </label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                                placeholder="admin"
                                required
                                autoComplete="username"
                            />
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                        >
                            비밀번호
                        </label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-11 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                            <AlertCircle size={16} className="text-red-500 shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-accent text-white font-medium text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                로그인 중...
                            </>
                        ) : (
                            "로그인"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="text-sm text-slate-400 hover:text-accent transition-colors inline-flex items-center gap-1.5"
                    >
                        <ArrowLeft size={14} />
                        사이트로 돌아가기
                    </a>
                </div>
            </div>
        </div>
    );
}
