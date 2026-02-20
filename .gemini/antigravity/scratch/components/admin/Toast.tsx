"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, AlertCircle, X, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "success") => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3500);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const iconMap = {
        success: <CheckCircle size={16} className="text-green-500 shrink-0" />,
        error: <AlertCircle size={16} className="text-red-500 shrink-0" />,
        info: <Info size={16} className="text-blue-500 shrink-0" />,
    };

    const bgMap = {
        success: "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30",
        error: "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30",
        info: "border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30",
    };

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-right ${bgMap[t.type]}`}
                        style={{ animation: "slideIn 0.3s ease-out" }}
                    >
                        {iconMap[t.type]}
                        <p className="text-sm text-slate-700 dark:text-slate-200 flex-1">{t.message}</p>
                        <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <style jsx global>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(100%); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </ToastContext.Provider>
    );
}
