import * as React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
import { useAuthStore } from "../store/authStore";
import { useCompanyStore } from "../store/companyStore";

interface NavItemProps {
    icon: React.ElementType;
    label: string;
    to: string;
    end?: boolean;
}

const NavItem = ({ icon: Icon, label, to, end }: NavItemProps) => (
    <NavLink
        to={to}
        end={end}
        className={({ isActive }) => cn(
            "group flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-all relative",
            isActive
                ? "bg-primary-50 text-primary-500 border-l-4 border-primary-500"
                : "text-surface-900 hover:bg-surface-100 border-l-4 border-transparent"
        )}
    >
        {({ isActive }) => (
            <>
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-500" : "text-surface-900 group-hover:text-primary-500")} />
                {label}
            </>
        )}
    </NavLink>
);

export const Sidebar = () => {
    const navigate = useNavigate();
    const { logout, user, setEnvironment } = useAuthStore();
    const { currentCompany, isLoading } = useCompanyStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <aside className="flex h-screen w-64 flex-col border-r border-surface-300 bg-white shrink-0">
            {/* Brand Logo */}
            <div className="flex h-24 items-center justify-center border-b border-surface-100">
                <h1 className="font-serif text-3xl font-bold tracking-tight text-primary-700">
                    Brand Logo
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 pt-4 overflow-y-auto">
                <NavItem
                    icon={LayoutDashboard}
                    label="Dashboard"
                    to="/dashboard"
                    end
                />

                <NavItem
                    icon={FileText}
                    label="Invoices"
                    to="/dashboard/invoices"
                />
                <NavItem
                    icon={Clock}
                    label="Logs"
                    to="/dashboard/logs"
                />
                <NavItem
                    icon={Settings}
                    label="Settings"
                    to="/dashboard/settings"
                />
            </nav>

            {/* Environment Switcher */}
            <div className="px-4 py-6 space-y-3">
                <Badge
                    variant={user?.currentEnvironment === 'live' ? 'success' : 'warning'}
                    className="w-full justify-center py-2.5 rounded-lg text-sm"
                    icon={user?.currentEnvironment === 'live' ? <Settings className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
                >
                    {user?.currentEnvironment === 'live' ? 'Live Environment' : 'Test Environment'}
                </Badge>
                <Button
                    variant="outline"
                    className="w-full h-11 border-surface-200 text-surface-400 hover:text-surface-900"
                    onClick={() => setEnvironment(user?.currentEnvironment === 'live' ? 'test' : 'live')}
                    disabled={isLoading}
                >
                    {isLoading ? 'Switching...' : (user?.currentEnvironment === 'live' ? 'Switch to Test' : 'Switch to Live')}
                </Button>
            </div>

            {/* User Session */}
            <div className="border-t border-surface-100 p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-500 text-white font-bold">
                        AM
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="truncate text-sm font-bold text-surface-900">{currentCompany?.name || "No Company"}</p>
                        <p className="truncate text-[10px] text-surface-400 font-medium">{currentCompany?.taxId || "ID: ---"}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full h-11 gap-2 bg-primary-50/30 border-primary-100 text-surface-900 hover:bg-primary-50/50"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </aside>
    );
};

