"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

interface AnalyticsData {
    dailyVisitors: Record<string, number>;
    referrers: Record<string, number>;
    projectCategories: Record<string, number>;
    stats: {
        totalMessages: number;
        unreadMessages: number;
        totalProjects: number;
        totalSkills: number;
        totalViews: number;
    };
}

const chartColors = [
    "#3b82f6", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b",
    "#ef4444", "#ec4899", "#14b8a6", "#f97316", "#6366f1",
];

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
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 h-72 animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6" />
                        <div className="h-40 bg-slate-100 dark:bg-slate-800 rounded" />
                    </div>
                ))}
            </div>
        );
    }

    const dailyLabels = Object.keys(data.dailyVisitors).map((d) => {
        const date = new Date(d);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const dailyValues = Object.values(data.dailyVisitors);

    const lineData = {
        labels: dailyLabels,
        datasets: [
            {
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
            },
        ],
    };

    const lineOptions = {
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
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: "#94a3b8", font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { color: "rgba(148, 163, 184, 0.1)" },
                ticks: {
                    color: "#94a3b8",
                    font: { size: 11 },
                    stepSize: 1,
                },
            },
        },
    };

    // Project category pie chart
    const catLabels = Object.keys(data.projectCategories);
    const catValues = Object.values(data.projectCategories);

    const pieData = {
        labels: catLabels,
        datasets: [
            {
                data: catValues,
                backgroundColor: chartColors.slice(0, catLabels.length),
                borderWidth: 0,
                hoverOffset: 8,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "right" as const,
                labels: {
                    color: "#94a3b8",
                    font: { size: 11 },
                    padding: 12,
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            tooltip: {
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                padding: 12,
                cornerRadius: 8,
            },
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
                    <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Visitor Line Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">최근 7일 방문자</h3>
                    <div className="h-56">
                        <Line data={lineData} options={lineOptions} />
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">프로젝트 카테고리 분포</h3>
                    <div className="h-56">
                        {catLabels.length > 0 ? (
                            <Doughnut data={pieData} options={pieOptions} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-sm text-slate-400">
                                프로젝트를 먼저 등록해주세요.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Referrer Breakdown */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">유입 경로 (Top 5)</h3>
                {refEntries.length > 0 ? (
                    <div className="space-y-3">
                        {refEntries.map(([source, count], i) => {
                            const maxCount = refEntries[0][1];
                            const width = Math.max((count / maxCount) * 100, 8);
                            return (
                                <div key={source} className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono w-5">{i + 1}</span>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">{source}</span>
                                            <span className="text-xs text-slate-500 font-mono">{count}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${width}%`,
                                                    backgroundColor: chartColors[i],
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">아직 방문 데이터가 없습니다.</p>
                )}
            </div>
        </div>
    );
}
