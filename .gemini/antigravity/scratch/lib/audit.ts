import { prisma } from "@/lib/db";

export async function logAudit(
    userId: string,
    action: "CREATE" | "UPDATE" | "DELETE",
    entity: string,
    entityId: string,
    prevData?: Record<string, unknown> | null,
    newData?: Record<string, unknown> | null
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                prevData: prevData ? JSON.stringify(prevData) : null,
                newData: newData ? JSON.stringify(newData) : null,
            },
        });
    } catch (err) {
        console.error("Failed to create audit log:", err);
    }
}
