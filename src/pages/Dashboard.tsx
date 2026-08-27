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
    SlidersHorizontal
} from "lucide-react";
import { useReceiptStore } from "../store/receiptStore";
import { useLogStore } from "../store/logStore";

export default function Dashboard() {
    const [isTimelineSettingsOpen, setIsTimelineSettingsOpen] = React.useState(false);
    const [selectedPeriod, setSelectedPeriod] = React.useState("7days");

    // Store Integration
    const { totalReceipts, fetchReceipts, receipts } = useReceiptStore();
    const { logs, fetchLogs } = useLogStore();

    React.useEffect(() => {
        fetchReceipts({ limit: 10, page: 1 });
        fetchLogs({ limit: 100, page: 1 });
    }, [fetchReceipts, fetchLogs]);

    const activeInvoicesCount = totalReceipts || 0;
    const pendingCount = receipts.filter(r => r.status === 'Processing' || r.status === 'Pending').length;
    const failedTodayCount = logs.filter(l => l.level === 'error' && new Date(l.timestamp).toDateString() === new Date().toDateString()).length;

    const handleRefresh = () => {
        fetchReceipts({ limit: 1, page: 1 });
        fetchLogs({ limit: 100, page: 1 });
    };

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
                        <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200" onClick={handleRefresh}>
                            <RefreshCw className="h-4 w-4 text-primary-500" />
                            Refresh
                        </Button>
                    </div>
                </header>

                {/* Stats */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<FileText className="h-5 w-5 text-primary-500" />}
                        iconBg="bg-[#0073E64A]"
                        label="Invoices Processed"
                        value={activeInvoicesCount.toLocaleString()}
                        trend={{ value: "12%", isUp: true }}
                    />
                    <StatCard
                        icon={<Clock className="h-5 w-5 text-[#67550F]" />}
                        iconBg="bg-[#FEF3C7]"
                        label="Pending Clearance"
                        value={String(pendingCount)}
                        trend={{ value: "5%", isUp: false }}
                    />
                    <StatCard
                        icon={<CheckCircle2 className="h-5 w-5 text-[#29974F]" />}
                        iconBg="bg-[#DCFCE7]"
                        label="Uptime"
                        value="99.95%"
                        trend={{ value: "0%", isUp: true }}
                    />
                    <StatCard
                        icon={<AlertTriangle className="h-5 w-5 text-[#A33131]" />}
                        iconBg="bg-[#FEE2E2]"
                        label="Failed Today"
                        value={String(failedTodayCount)}
                        trend={{ value: "2%", isUp: false }}
                        className="[&_.h-10.w-10]:bg-danger-100 [&_.h-10.w-10]:text-danger-500"
                    />
                </section>

                {/* Quick Actions */}
                <QuickActions />

                {/* Recent Activity */}
                <RecentActivity />

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
