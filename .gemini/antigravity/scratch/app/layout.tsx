import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/layout/ScrollProgress";
import BackToTop from "@/components/layout/BackToTop";
import PageTracker from "@/components/layout/PageTracker";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Portfolio | Minimalist Tech Professional",
    description:
        "프론트엔드 개발자 포트폴리오 - React, Next.js, TypeScript 전문",
    keywords: ["포트폴리오", "프론트엔드", "개발자", "React", "Next.js"],
    openGraph: {
        title: "Portfolio | Minimalist Tech Professional",
        description:
            "프론트엔드 개발자 포트폴리오 - React, Next.js, TypeScript 전문",
        type: "website",
    },
};

import { getSiteSettings } from "@/lib/settings";
import MaintenanceGuard from "@/components/layout/MaintenanceGuard";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSiteSettings();

    return (
        <html
            lang="ko"
            suppressHydrationWarning
            className={`${inter.variable} ${jetbrainsMono.variable}`}
        >
            <body className="font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <MaintenanceGuard maintenanceMode={settings.maintenanceMode}>
                        <ConditionalLayout>
                            <ScrollProgress />
                        </ConditionalLayout>
                        <PageTracker />
                        <ConditionalLayout>
                            <Header />
                        </ConditionalLayout>
                        <main>{children}</main>
                        <ConditionalLayout>
                            <Footer />
                            <BackToTop />
                        </ConditionalLayout>
                    </MaintenanceGuard>
                </ThemeProvider>
            </body>
        </html>
    );
}
