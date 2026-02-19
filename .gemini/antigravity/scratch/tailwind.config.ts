import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0F172A",
                accent: "#3B82F6",
                "bg-light": "#FFFFFF",
                "bg-dark": "#020617",
            },
            fontFamily: {
                sans: [
                    "Pretendard",
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "system-ui",
                    "Roboto",
                    "sans-serif",
                ],
                mono: ["JetBrains Mono", "Fira Code", "monospace"],
            },
            animation: {
                "fade-in": "fadeIn 0.8s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "gradient-x": "gradientX 3s ease infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                gradientX: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
        },
    },
    plugins: [],
};

export default config;
