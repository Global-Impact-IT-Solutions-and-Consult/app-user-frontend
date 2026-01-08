import * as React from "react";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-surface-100 font-sans">
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};
