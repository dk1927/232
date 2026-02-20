"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="맨 위로"
            className={`
                fixed bottom-8 right-8 z-50 p-3 rounded-full
                bg-accent text-white shadow-lg shadow-accent/25
                hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-accent/40
                transition-all duration-300
                ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
            `}
        >
            <ArrowUp size={20} />
        </button>
    );
}
