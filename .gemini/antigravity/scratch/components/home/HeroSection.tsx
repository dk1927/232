"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

export default function HeroSection() {
    return (
        <section
            id="hero"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-accent/3 to-cyan-500/3 rounded-full blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-32 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20">
                        <Sparkles size={14} />
                        Open to opportunities
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="mt-8 text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1]"
                >
                    안녕하세요,
                    <br />
                    <span className="gradient-text">개발자</span>입니다.
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                >
                    사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.
                    <br className="hidden md:block" />
                    깔끔한 코드와 아름다운 인터페이스를 만들어 갑니다.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#projects"
                        className="px-8 py-3.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5"
                    >
                        프로젝트 보기
                    </a>
                    <a
                        href="#contact"
                        className="px-8 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:-translate-y-0.5"
                    >
                        연락하기
                    </a>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
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
            </div>
        </section>
    );
}
