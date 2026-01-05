import * as React from "react";
import {
    LayoutDashboard,
    FileText,
    Clock,
    Settings,
    FlaskConical,
    LogOut as LogOutIcon
} from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, onClick }: NavItemProps) => (
    <button
        onClick={onClick}
        className={cn(
            "group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative",
            isActive
                ? "bg-primary-50 text-primary-500 border-l-4 border-primary-500"
                : "text-surface-900 hover:bg-surface-100 border-l-4 border-transparent"
        )}
    >
        <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-500" : "text-surface-900 group-hover:text-primary-500")} />
        {label}
    </button>
);

export const Sidebar = () => {
    const [activeTab, setActiveTab] = React.useState("Dashboard");

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-surface-300 bg-white">
            {/* Brand Logo */}
            <div className="flex h-24 items-center justify-center border-b border-surface-100">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-700">
                    Brand Logo
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 pt-4">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    isActive={activeTab === "Dashboard"}
                    onClick={() => setActiveTab("Dashboard")}
                />
                <NavItem
                    icon={FileText}
                    label="Invoices"
                    isActive={activeTab === "Invoices"}
                    onClick={() => setActiveTab("Invoices")}
                />
                <NavItem
                    icon={Clock}
                    label="Logs"
                    isActive={activeTab === "Logs"}
                    onClick={() => setActiveTab("Logs")}
                />
                <NavItem
                    icon={Settings}
                    label="Settings"
                    isActive={activeTab === "Settings"}
                    onClick={() => setActiveTab("Settings")}
                />
            </nav>

            {/* Environment Switcher */}
            <div className="px-4 py-6 space-y-3">
                <Badge
                    variant="warning"
                    className="w-full justify-center py-2.5 rounded-lg text-sm"
                    icon={<FlaskConical className="h-4 w-4" />}
                >
                    Test Environment
                </Badge>
                <Button variant="outline" className="w-full h-11 border-surface-200 text-surface-400 hover:text-surface-900">
                    Switch to live
                </Button>
            </div>

            {/* User Session */}
            <div className="border-t border-surface-100 p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white font-bold">
                        AM
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-surface-900">Acme Manufacturing</p>
                        <p className="truncate text-[10px] text-surface-400 font-medium">NG-APP-5678-ACME</p>
                    </div>
                </div>
                <Button variant="outline" className="w-full h-11 gap-2 bg-primary-50/30 border-primary-100 text-surface-900 hover:bg-primary-50/50">
                    <LogOutIcon className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </aside>
    );
};
