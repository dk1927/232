"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    { label: "소개", href: "#hero" },
    { label: "기술 스택", href: "#skills" },
    { label: "프로젝트", href: "#projects" },
    { label: "문의", href: "#contact" },
];

export default function Header() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("#hero");

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Track active section with IntersectionObserver
    useEffect(() => {
        const sections = navLinks.map((l) => document.querySelector(l.href));
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(`#${entry.target.id}`);
                    }
                });
            },
            { rootMargin: "-40% 0px -60% 0px" }
        );
        sections.forEach((s) => s && observer.observe(s));
        return () => observer.disconnect();
    }, []);

    // Don't render public header on admin routes
    if (pathname?.startsWith("/admin")) return null;

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                scrolled
                    ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 dark:border-slate-700/50"
                    : "bg-transparent"
            )}
        >
            <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <a
                    href="#hero"
                    className="text-lg font-bold tracking-tight text-slate-900 dark:text-white hover:text-accent transition-colors group"
                >
                    Portfolio<span className="text-accent group-hover:animate-pulse">.</span>
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                activeSection === link.href
                                    ? "text-accent bg-accent/10"
                                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
                            )}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div className="ml-2 pl-3 border-l border-slate-200 dark:border-slate-700">
                        {mounted && (
                            <button
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="p-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center gap-2 md:hidden">
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                        className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Nav */}
            <div
                className={cn(
                    "md:hidden transition-all duration-300 overflow-hidden",
                    mobileOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                                    activeSection === link.href
                                        ? "text-accent bg-accent/10"
                                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
