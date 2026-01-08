import * as React from "react";
import { StatCard } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { QuickActions } from "../components/QuickActions";
import { RecentActivity } from "../components/RecentActivity";
import { SystemStatus } from "../components/SystemStatus";
import { TimelineSettings } from "../components/TimelineSettings";
import {
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    RefreshCw,
    Plus,
    SlidersHorizontal
} from "lucide-react";

export default function Dashboard() {
    const [isTimelineSettingsOpen, setIsTimelineSettingsOpen] = React.useState(false);
    const [selectedPeriod, setSelectedPeriod] = React.useState("7days");

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold text-surface-900 font-serif">Dashboard</h1>
                        <p className="text-surface-900 text-sm">
                            Welcome back! Monitor your e-invoice activity.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsTimelineSettingsOpen(true)}
                            className="p-2.5 hover:bg-surface-100 rounded-lg transition-colors text-surface-900"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                        </button>
                        <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200">
                            <RefreshCw className="h-4 w-4 text-primary-500" />
                            Refresh
                        </Button>
                        <Button className="gap-2 h-11 px-6 font-bold">
                            <Plus className="h-4 w-4" />
                            New Invoice
                        </Button>
                    </div>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<FileText className="h-5 w-5 text-primary-500" />}
                        iconBg="bg-[#0073E64A]"
                        label="Invoices Processed"
                        value="1,247"
                        trend={{ value: "12%", isUp: true }}
                    />
                    <StatCard
                        icon={<Clock className="h-5 w-5 text-[#67550F]" />}
                        iconBg="bg-[#FEF3C7]"
                        label="Pending Clearance"
                        value="18"
                        trend={{ value: "12%", isUp: true }}
                    />
                    <StatCard
                        icon={<CheckCircle2 className="h-5 w-5 text-[#29974F]" />}
                        iconBg="bg-[#DCFCE7]"
                        label="Uptime"
                        value="99.95%"
                        trend={{ value: "12%", isUp: true }}
                    />
                    <StatCard
                        icon={<AlertTriangle className="h-5 w-5 text-[#A33131]" />}
                        iconBg="bg-[#FEE2E2]"
                        label="Failed Today"
                        value="5"
                        trend={{ value: "12%", isUp: true }}
                        className="[&_.h-10.w-10]:bg-danger-100 [&_.h-10.w-10]:text-danger-500"
                    />
                </section>

                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Activity */}
                <RecentActivity period={selectedPeriod} />

                {/* System Status */}
                <SystemStatus />
            </div>

            <TimelineSettings
                isOpen={isTimelineSettingsOpen}
                onClose={() => setIsTimelineSettingsOpen(false)}
                activePeriodId={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
            />
        </div>
    );
}
