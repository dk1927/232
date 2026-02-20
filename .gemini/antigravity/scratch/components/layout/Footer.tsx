import { prisma } from "@/lib/db";
import { Github, Mail, Linkedin, ArrowUp } from "lucide-react";

const navLinks = [
    { label: "소개", href: "#hero" },
    { label: "기술 스택", href: "#skills" },
    { label: "프로젝트", href: "#projects" },
    { label: "문의", href: "#contact" },
];

export default async function Footer() {
    const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });

    const s = settings || {
        siteName: "Portfolio",
        footerTagline: "Minimalist Tech Professional",
        githubUrl: "https://github.com",
        linkedinUrl: "https://linkedin.com",
        email: "hello@example.com",
    };

    return (
        <footer className="relative border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-bg-dark overflow-hidden">
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            {s.siteName}<span className="text-accent">.</span>
                        </p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            {s.footerTagline}
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                            Navigation
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-accent transition-colors py-1"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Social Links */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
                            Connect
                        </p>
                        <div className="flex items-center gap-2">
                            <a
                                href={s.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-900 transition-all"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href={s.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-blue-600 transition-all"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href={`mailto:${s.email}`}
                                aria-label="Email"
                                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-white hover:bg-accent transition-all"
                            >
                                <Mail size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        © {new Date().getFullYear()} {s.siteName}. Built with Next.js &
                        Tailwind CSS.
                    </p>
                    <a
                        href="#hero"
                        className="text-xs text-slate-400 dark:text-slate-500 hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                        <ArrowUp size={12} />
                        맨 위로
                    </a>
                </div>
            </div>
        </footer>
    );
}
