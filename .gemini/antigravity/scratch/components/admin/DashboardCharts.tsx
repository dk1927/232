"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Radar, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    RadialLinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface AnalyticsData {
    dailyVisitors: Record<string, number>;
    referrers: Record<string, number>;
    topPages: Record<string, number>;
    sectorExpertise: { sector: string; avgDifficulty: number; projectCount: number }[];
    topTechStack: { tech: string; count: number }[];
    stats: {
        totalMessages: number;
        unreadMessages: number;
        totalProjects: number;
        totalSkills: number;
        totalViews: number;
    };
}

export default function DashboardCharts() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/analytics");
            if (!res.ok) throw new Error();
            setData(await res.json());
        } catch {
            console.error("Failed to fetch analytics");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-72 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
                        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    // Visitor Line Chart
    const dailyLabels = Object.keys(data.dailyVisitors).map((d) => {
        const date = new Date(d);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const dailyValues = Object.values(data.dailyVisitors);

    const lineData = {
        labels: dailyLabels,
        datasets: [{
            label: "방문자 수",
            data: dailyValues,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#3b82f6",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
        }],
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
            },
        },
    };

    const lineOptions = {
        ...commonOptions,
        scales: {
            x: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8", font: { size: 11 }, stepSize: 1 } },
        },
    };

    // Sector Expertise Radar Chart
    const sectorLabels = data.sectorExpertise?.map(s => s.sector) || [];
    const sectorValues = data.sectorExpertise?.map(s => s.avgDifficulty) || [];

    const radarData = {
        labels: sectorLabels,
        datasets: [{
            label: "평균 난이도",
            data: sectorValues,
            backgroundColor: "rgba(139, 92, 246, 0.2)", // Violet
            borderColor: "#8b5cf6",
            pointBackgroundColor: "#8b5cf6",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#8b5cf6",
            fill: true,
        }],
    };

    const radarOptions = {
        ...commonOptions,
        scales: {
            r: {
                angleLines: { color: "rgba(148, 163, 184, 0.1)" },
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                pointLabels: { color: "#94a3b8", font: { size: 11, weight: "bold" as const } },
                ticks: { display: false, backdropColor: "transparent" },
                suggestedMin: 0,
                suggestedMax: 5,
            },
        },
    };

    // Tech Stack Bar Chart
    const techLabels = data.topTechStack?.map(t => t.tech) || [];
    const techValues = data.topTechStack?.map(t => t.count) || [];

    const barData = {
        labels: techLabels,
        datasets: [{
            label: "프로젝트 사용 횟수",
            data: techValues,
            backgroundColor: "#10b981", // Emerald
            borderRadius: 4,
            barThickness: 20,
        }],
    };

    const barOptions = {
        ...commonOptions,
        indexAxis: 'y' as const,
        scales: {
            x: { grid: { color: "rgba(148, 163, 184, 0.1)" }, ticks: { color: "#94a3b8", font: { size: 10 } } },
            y: { grid: { display: false }, ticks: { color: "#94a3b8", font: { size: 11, weight: "bold" as const }, autoSkip: false } },
        },
    };

    // Referrer breakdown
    const refEntries = Object.entries(data.referrers)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                    { label: "7일 방문", value: data.stats.totalViews, color: "text-blue-500" },
                    { label: "프로젝트", value: data.stats.totalProjects, color: "text-emerald-500" },
                    { label: "스킬", value: data.stats.totalSkills, color: "text-cyan-500" },
                    { label: "전체 메시지", value: data.stats.totalMessages, color: "text-purple-500" },
                    { label: "안읽은 메시지", value: data.stats.unreadMessages, color: "text-orange-500" },
                ].map((s) => (
                    <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center shadow-sm">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row 1: Visitor & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitor Line Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">최근 7일 방문자</h3>
                    <div className="h-64">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                {/* Sector Expertise Radar Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">섹터별 전문성 (평균 난이도)</h3>
                    <div className="h-64 flex items-center justify-center">
                        {sectorLabels.length > 0 ? (
                            <Radar data={radarData} options={radarOptions} />
                        ) : (
                            <div className="text-sm text-slate-400">데이터가 부족합니다.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Charts Row 2: Tech Stack & Referrers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Tech Stack Bar Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">핵심 기술 스택 (Top 10)</h3>
                    <div className="h-64">
                        {techLabels.length > 0 ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-slate-400">
                                프로젝트 태그 데이터가 없습니다.
                            </div>
                        )}
                    </div>
                </div>

                {/* Referrer Breakdown */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">유입 경로 (Top 5)</h3>
                    {refEntries.length > 0 ? (
                        <div className="space-y-4">
                            {refEntries.map(([source, count], i) => {
                                const maxCount = refEntries[0][1];
                                const width = Math.max((count / maxCount) * 100, 8);
                                const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
                                return (
                                    <div key={source} className="flex items-center gap-3">
                                        <span className="text-xs text-slate-400 font-mono w-5">{i + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{source}</span>
                                                <span className="text-xs text-slate-500 font-mono">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${width}%`,
                                                        backgroundColor: colors[i % colors.length],
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-56 flex items-center justify-center text-sm text-slate-400">
                            아직 방문 데이터가 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
