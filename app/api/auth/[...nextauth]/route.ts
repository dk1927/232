import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from "bcryptjs";
import { prisma } from "@/lib/db";
import { rateLimit, rateLimitResponse, logSecurityEvent } from "@/lib/rateLimit";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "아이디", type: "text" },
                password: { label: "비밀번호", type: "password" },
            },
            async authorize(credentials, req) {
                // Rate limit login attempts
                const forwarded = req?.headers?.["x-forwarded-for"];
                const ip = typeof forwarded === "string" ? forwarded.split(",")[0] : "unknown";
                const { allowed, retryAfterMs } = rateLimit(ip, "/api/auth", { maxRequests: 5, windowMs: 60_000 });

                if (!allowed) {
                    await logSecurityEvent(ip, "/api/auth", "POST", 429, "Login rate limit exceeded");
                    throw new Error("Too many login attempts. Please try again later.");
                }

                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user) {
                    await logSecurityEvent(ip, "/api/auth", "POST", 401, `Failed login: user '${credentials.username}' not found`);
                    return null;
                }

                const isValid = await bcryptjs.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    await logSecurityEvent(ip, "/api/auth", "POST", 401, `Failed login: invalid password for '${credentials.username}'`);
                    return null;
                }

                return {
                    id: user.id,
                    name: user.username,
                    role: user.role,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as unknown as { role: string }).role;
                token.userId = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as { role?: string }).role = token.role as string;
                (session.user as { userId?: string }).userId = token.userId as string;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: "/admin/login",
    },
    secret: process.env.NEXTAUTH_SECRET || "portfolio-admin-secret-key-change-in-production",
});

export { handler as GET, handler as POST };
