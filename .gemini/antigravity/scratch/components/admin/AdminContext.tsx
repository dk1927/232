"use client";

import { createContext, useContext } from "react";

interface AdminContextValue {
    role: string;
    isAdmin: boolean;
}

const AdminContext = createContext<AdminContextValue>({ role: "VIEWER", isAdmin: false });

export function AdminProvider({ role, children }: { role: string; children: React.ReactNode }) {
    return (
        <AdminContext.Provider value={{ role, isAdmin: role === "ADMIN" }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminRole() {
    return useContext(AdminContext);
}
