"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
    name: string;
    email: string;
    message: string;
}

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Form submitted:", data);
        setSubmitted(true);
        reset();
        setTimeout(() => setSubmitted(false), 5000);
    };

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

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mt-14 max-w-xl"
                >
                    {submitted ? (
                        <div className="glass-card p-8 text-center">
                            <CheckCircle className="mx-auto text-green-500" size={48} />
                            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                                메시지가 전송되었습니다!
                            </h3>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                빠른 시일 내에 답변드리겠습니다. 감사합니다.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                                >
                                    이름
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="홍길동"
                                    {...register("name", { required: "이름을 입력해주세요." })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                                />
                                {errors.name && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                        <AlertCircle size={12} />
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                                >
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
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm"
                                />
                                {errors.email && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                        <AlertCircle size={12} />
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                                >
                                    메시지
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    placeholder="프로젝트에 대해 말씀해주세요..."
                                    {...register("message", {
                                        required: "메시지를 입력해주세요.",
                                        minLength: {
                                            value: 10,
                                            message: "최소 10자 이상 입력해주세요.",
                                        },
                                    })}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-sm resize-none"
                                />
                                {errors.message && (
                                    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                                        <AlertCircle size={12} />
                                        {errors.message.message}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-blue-600 transition-all shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                            </button>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
