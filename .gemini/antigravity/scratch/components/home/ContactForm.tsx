"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, AlertCircle, Mail, Github, Linkedin, MapPin } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    message: string;
}

interface ContactInfo {
    email?: string;
    githubUrl?: string;
    linkedinUrl?: string;
}

export default function ContactForm({ contactInfo }: { contactInfo?: ContactInfo }) {
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setSubmitError(false);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                setSubmitError(true);
            }
        } catch {
            setSubmitError(true);
        }
    };

    const info = contactInfo || {};

    const inputClass = "w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm";

    return (
        <section id="contact" className="py-24 md:py-32">
            <div className="max-w-5xl mx-auto px-6">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="section-title">
                        문의하기<span className="text-accent">.</span>
                    </h2>
                    <p className="section-subtitle">
                        프로젝트 제안, 협업 문의, 또는 간단한 인사도 환영합니다.
                    </p>
                </motion.div>

                <div className="mt-14 grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left: Contact Info Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        <div className="glass-card-hover p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-accent/10">
                                    <Mail size={20} className="text-accent" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">이메일</p>
                                    <a
                                        href={`mailto:${info.email || "hello@example.com"}`}
                                        className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-accent transition-colors"
                                    >
                                        {info.email || "hello@example.com"}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {info.githubUrl && (
                            <div className="glass-card-hover p-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                                        <Github size={20} className="text-slate-600 dark:text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">GitHub</p>
                                        <a
                                            href={info.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-accent transition-colors"
                                        >
                                            {info.githubUrl.replace("https://github.com/", "@")}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {info.linkedinUrl && (
                            <div className="glass-card-hover p-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                        <Linkedin size={20} className="text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">LinkedIn</p>
                                        <a
                                            href={info.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-accent transition-colors"
                                        >
                                            프로필 보기
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="glass-card-hover p-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                    <MapPin size={20} className="text-emerald-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">위치</p>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Seoul, Korea 🇰🇷
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        {submitted ? (
                            <div className="glass-card p-10 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle className="mx-auto text-green-500" size={56} />
                                </motion.div>
                                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                                    메시지가 전송되었습니다!
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                    빠른 시일 내에 답변드리겠습니다. 감사합니다.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Name */}
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            이름
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            placeholder="홍길동"
                                            {...register("name", { required: "이름을 입력해주세요." })}
                                            className={inputClass}
                                        />
                                        {errors.name && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle size={12} /> {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            이메일
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="hello@example.com"
                                            {...register("email", {
                                                required: "이메일을 입력해주세요.",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "올바른 이메일 형식을 입력해주세요.",
                                                },
                                            })}
                                            className={inputClass}
                                        />
                                        {errors.email && (
                                            <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                                <AlertCircle size={12} /> {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                        메시지
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        placeholder="프로젝트에 대해 말씀해주세요..."
                                        {...register("message", {
                                            required: "메시지를 입력해주세요.",
                                            minLength: { value: 10, message: "최소 10자 이상 입력해주세요." },
                                        })}
                                        className={inputClass + " resize-none"}
                                    />
                                    {errors.message && (
                                        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                            <AlertCircle size={12} /> {errors.message.message}
                                        </p>
                                    )}
                                </div>

                                {submitError && (
                                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                                        <AlertCircle size={16} className="text-red-500 shrink-0" />
                                        <p className="text-sm text-red-600 dark:text-red-400">전송에 실패했습니다. 다시 시도해주세요.</p>
                                    </div>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            전송 중...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            메시지 보내기
                                        </>
                                    )}
                                    <div className="absolute inset-0 btn-shimmer" />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
