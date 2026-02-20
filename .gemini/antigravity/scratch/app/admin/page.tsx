import { prisma } from "@/lib/db";
import Link from "next/link";
import {
    FolderKanban,
    Cpu,
    Mail,
    MailOpen,
    ArrowRight,
    Clock,
    Plus,
} from "lucide-react";
import DashboardCharts from "@/components/admin/DashboardCharts";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    const [recentMessages, recentProjects] = await Promise.all([
        prisma.contactMessage.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        }),
        prisma.project.findMany({
            take: 3,
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                        대시보드
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        포트폴리오 사이트 현황을 한눈에 확인하세요.
                    </p>
                </div>
                <Link
                    href="/admin/projects"
                    className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                    <Plus size={16} />
                    새 프로젝트
                </Link>
            </div>

            {/* Charts Section */}
            <DashboardCharts />

            {/* Two Column: Recent Messages + Recent Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Messages */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Mail size={16} className="text-purple-500" />
                            최근 메시지
                        </h2>
                        <Link
                            href="/admin/messages"
                            className="text-xs text-accent hover:underline flex items-center gap-1"
                        >
                            전체 보기 <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recentMessages.length > 0 ? (
                            recentMessages.map((msg: { id: string; name: string; message: string; read: boolean; createdAt: Date }) => (
                                <div key={msg.id} className="px-5 py-3.5 flex items-center gap-3">
                                    <div
                                        className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? "bg-slate-300 dark:bg-slate-600" : "bg-accent animate-pulse"
                                            }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                            {msg.name}
                                        </p>
                                        <p className="text-xs text-slate-400 truncate">{msg.message}</p>
                                    </div>
                                    <span className="text-xs text-slate-400 shrink-0 flex items-center gap-1">
                                        <Clock size={10} />
                                        {new Date(msg.createdAt).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="px-5 py-8 text-center text-sm text-slate-400">
                                받은 메시지가 없습니다.
                            </p>
                        )}
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FolderKanban size={16} className="text-blue-500" />
                            최근 프로젝트
                        </h2>
                        <Link
                            href="/admin/projects"
                            className="text-xs text-accent hover:underline flex items-center gap-1"
                        >
                            전체 보기 <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {recentProjects.map((project: { id: string; title: string; description: string; tags: string }) => (
                            <div key={project.id} className="px-5 py-3.5">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {project.title}
                                </p>
                                <p className="mt-1 text-xs text-slate-400 truncate">
                                    {project.description}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {(JSON.parse(project.tags) as string[]).slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-[10px] font-mono text-accent bg-accent/10 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
