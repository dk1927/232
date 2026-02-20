"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/admin/Toast";
import AuthProvider from "@/components/admin/AuthProvider";
import {
    LayoutDashboard,
    FolderKanban,
    Cpu,
    Settings,
    Mail,
    LogOut,
    Home,
    Menu,
    X,
    ChevronRight,
    Users,
    FileText,
    Webhook,
} from "lucide-react";

const navItems = [
    { label: "대시보드", href: "/admin", icon: LayoutDashboard },
    { label: "프로젝트", href: "/admin/projects", icon: FolderKanban },
    { label: "스킬", href: "/admin/skills", icon: Cpu },
    { label: "메시지", href: "/admin/messages", icon: Mail },
    { label: "사용자", href: "/admin/users", icon: Users },
    { label: "감사 로그", href: "/admin/audit", icon: FileText },
    { label: "웹훅", href: "/admin/webhooks", icon: Webhook },
    { label: "설정", href: "/admin/settings", icon: Settings },
];

function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    const currentPage = navItems.find(
        (item) =>
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href))
    );

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-14 flex items-center justify-between px-4">
                <button
                    onClick={() => setMobileOpen(true)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <Menu size={20} />
                </button>
                <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {currentPage && (() => { const Icon = currentPage.icon; return <Icon size={16} />; })()}
                    {currentPage?.label || "관리자"}
                </span>
                <div className="w-9" />
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-[70] transition-transform duration-300",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
                            Portfolio<span className="text-accent">.</span>
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            관리자 패널
                        </p>
                    </div>
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <X size={18} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                    isActive
                                        ? "bg-accent/10 text-accent shadow-sm"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon size={18} />
                                    {item.label}
                                </div>
                                {isActive && <ChevronRight size={14} className="opacity-50" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    {session?.user && (
                        <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                {session.user.name}
                            </span>
                        </div>
                    )}
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <Home size={18} />
                        사이트 보기
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/admin/login" })}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                        <LogOut size={18} />
                        로그아웃
                    </button>
                </div>
            </aside>
        </>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (pathname === "/admin/login") {
        return (
            <AuthProvider>
                {children}
            </AuthProvider>
        );
    }

    return (
        <AuthProvider>
            <ToastProvider>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                    <AdminSidebar />
                    <main className="lg:ml-64 min-h-screen">
                        <div className="pt-14 lg:pt-0 p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </ToastProvider>
        </AuthProvider>
    );
}
