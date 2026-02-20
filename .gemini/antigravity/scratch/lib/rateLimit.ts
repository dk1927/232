import { NextResponse } from "next/server";

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((entry, key) => {
        if (now > entry.resetTime) {
            rateLimitMap.delete(key);
        }
    });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    windowMs?: number;   // time window in ms (default: 60000 = 1 min)
    maxRequests?: number; // max requests per window (default: 10)
}

export function rateLimit(
    ip: string,
    endpoint: string,
    config: RateLimitConfig = {}
): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const { windowMs = 60_000, maxRequests = 10 } = config;
    const key = `${ip}:${endpoint}`;
    const now = Date.now();

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetTime) {
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, retryAfterMs: 0 };
    }

    entry.count++;

    if (entry.count > maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetTime - now,
        };
    }

    return { allowed: true, remaining: maxRequests - entry.count, retryAfterMs: 0 };
}

export function rateLimitResponse(retryAfterMs: number) {
    return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
            status: 429,
            headers: {
                "Retry-After": String(Math.ceil(retryAfterMs / 1000)),
            },
        }
    );
}

export async function logSecurityEvent(
    ip: string,
    endpoint: string,
    method: string,
    status: number,
    message?: string
) {
    try {
        const { prisma } = await import("@/lib/db");
        await prisma.securityLog.create({
            data: { ip, endpoint, method, status, message },
        });
    } catch {
        console.error("Failed to log security event");
    }
}
