"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

interface HeroData {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    titleSuffix: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    profileImage?: string | null;
}

interface CounterProps {
    label: string;
    value: number;
    suffix?: string;
}

function AnimatedCounter({ label, value, suffix = "" }: CounterProps) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const step = Math.ceil(value / 40);
                    const interval = setInterval(() => {
                        start += step;
                        if (start >= value) {
                            setCount(value);
                            clearInterval(interval);
                        } else {
                            setCount(start);
                        }
                    }, 30);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [value]);

    return (
        <div ref={ref} className="text-center">
            <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white font-mono">
                {count}{suffix}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">{label}</p>
        </div>
    );
}

export default function HeroSection({
    hero,
    stats,
}: {
    hero: HeroData | null;
    stats?: { projects: number; skills: number; messages: number };
}) {
    const h = hero || {
        badge: "Open to opportunities",
        titleLine1: "안녕하세요,",
        titleLine2: "개발자",
        titleSuffix: "입니다.",
        subtitle: "사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.\n깔끔한 코드와 아름다운 인터페이스를 만들어 갑니다.",
        ctaPrimary: "프로젝트 보기",
        ctaSecondary: "연락하기",
        profileImage: null,
    };

    const containerRef = useRef<HTMLElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set((e.clientX - rect.left - rect.width / 2) / 15);
        mouseY.set((e.clientY - rect.top - rect.height / 2) / 15);
    };

    return (
        <section
            ref={containerRef}
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern"
            onMouseMove={handleMouseMove}
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
                <motion.div
                    className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/8 rounded-full blur-3xl"
                    style={{ x: springX, y: springY }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl"
                    style={{ x: springX, y: springY }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/5 to-cyan-500/5 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-32">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20">
                                <Sparkles size={14} className="animate-pulse" />
                                {h.badge}
                            </span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="mt-8 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                        >
                            {h.titleLine1}
                            <br />
                            <span className="gradient-text">{h.titleLine2}</span>{h.titleSuffix}
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="mt-6 text-base md:text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            {h.subtitle.split("\n").map((line, i) => (
                                <span key={i}>
                                    {line}
                                    {i < h.subtitle.split("\n").length - 1 && <br className="hidden md:block" />}
                                </span>
                            ))}
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <a
                                href="#projects"
                                className="relative px-8 py-3.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 overflow-hidden"
                            >
                                <span className="relative z-10">{h.ctaPrimary}</span>
                                <div className="absolute inset-0 btn-shimmer" />
                            </a>
                            <a
                                href="#contact"
                                className="px-8 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5 border border-slate-200 dark:border-slate-700"
                            >
                                {h.ctaSecondary}
                            </a>
                        </motion.div>
                    </div>

                    {/* Profile Image */}
                    {h.profileImage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative shrink-0"
                        >
                            <div className="relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                                {/* Glow behind */}
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 to-cyan-400/30 rounded-3xl blur-2xl -z-10 animate-glow-pulse" />
                                {/* Border gradient */}
                                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/50 to-cyan-400/50 p-[2px]">
                                    <div className="w-full h-full rounded-3xl overflow-hidden bg-white dark:bg-slate-900">
                                        <img
                                            src={h.profileImage}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                                {/* Decorative dots */}
                                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent/20 rounded-full animate-float" />
                                <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-cyan-400/20 rounded-full animate-float animate-delay-300" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Counters */}
                {stats && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-20 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0 lg:max-w-lg"
                    >
                        <AnimatedCounter label="Projects" value={stats.projects} suffix="+" />
                        <AnimatedCounter label="Skills" value={stats.skills} suffix="+" />
                        <AnimatedCounter label="Messages" value={stats.messages} />
                    </motion.div>
                )}
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <a
                    href="#skills"
                    className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-accent transition-colors"
                >
                    <span className="text-xs font-medium tracking-wider uppercase">
                        Scroll
                    </span>
                    <ArrowDown size={16} className="animate-bounce" />
                </a>
            </motion.div>
        </section>
    );
}
