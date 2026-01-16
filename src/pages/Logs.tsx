import * as React from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
    Upload,
    Trash2,
    Search,
    CheckCircle2,
    XCircle,
    ArrowRightLeft,
    Radio,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useLogStore } from "../store/logStore";

const tabs = [
    { label: "All Logs", id: "all" },
    { label: "API Calls", id: "api" },
    { label: "Webhooks", id: "webhooks" },
    { label: "Systems", id: "systems" },
    { label: "Errors", id: "errors" },
];

const StatCard = ({ icon: Icon, value, label, colorClass }: { icon: any, value: string, label: string, colorClass: string }) => (
    <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm flex flex-col items-center justify-center text-center space-y-2">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-1", colorClass)}>
            <Icon className="h-5 w-5" />
        </div>
        <p className="text-2xl font-bold text-surface-900">{value}</p>
        <p className="text-xs text-surface-900/70 font-medium">{label}</p>
    </div>
);

export default function Logs() {
    const { logs, totalLogs, isLoading, fetchLogs, clearLogs } = useLogStore();

    const [activeTab, setActiveTab] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [timeRange, setTimeRange] = React.useState("All Types");
    const [statusFilter, setStatusFilter] = React.useState("All Statuses");
    const [logLevel, setLogLevel] = React.useState("All Level");
    const [page, setPage] = React.useState(1);
    const limit = 20;

    React.useEffect(() => {
        const params: any = {
            page,
            limit
        };

        if (activeTab !== "all") {
            // Mapping tab "id" to API filter if supported
            // params.type = activeTab; 
        }

        if (searchQuery) {
            params.search = searchQuery;
        }

        fetchLogs(params);
    }, [activeTab, searchQuery, timeRange, statusFilter, logLevel, page, fetchLogs]);

    const handleClearLogs = async () => {
        if (confirm("Are you sure you want to clear all logs?")) {
            await clearLogs();
        }
    };

    // Client-side filtering fallback
    const filteredLogs = React.useMemo(() => {
        return logs.filter((log) => {
            const type = log.source || log.category || "System";
            const level = log.level || "info";

            // 1. Tab filtering
            if (activeTab === "api" && !type.toLowerCase().includes("api")) return false;
            if (activeTab === "webhooks" && !type.toLowerCase().includes("webhook")) return false;
            if (activeTab === "systems" && !type.toLowerCase().includes("system")) return false;
            if (activeTab === "errors" && level !== "error") return false;

            // 2. Select filters
            if (statusFilter !== "All Statuses") {
                if (statusFilter === "Success" && level !== "success") return false;
                if (statusFilter === "Warning" && level !== "warning") return false;
                if (statusFilter === "Error" && level !== "error") return false;
            }
            if (logLevel !== "All Level" && level !== logLevel.toLowerCase()) return false;

            // 3. Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    (log.message || "").toLowerCase().includes(query) ||
                    type.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [logs, activeTab, searchQuery, statusFilter, logLevel]);

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-surface-900 font-serif">System Logs</h1>
                    <p className="text-surface-900/70 text-sm">
                        Monitor API calls, webhook events, and system activity
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200">
                        <Upload className="h-4 w-4 text-primary-500" />
                        Export
                    </Button>
                    <Button className="gap-2 h-11 px-6 font-bold" onClick={handleClearLogs}>
                        <Trash2 className="h-4 w-4" />
                        Clear Logs
                    </Button>
                </div>
            </header>

            {/* Live Status Bar */}
            <div className="bg-success-50 border border-success-100 rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse" />
                <p className="text-xs text-success-700 font-medium">
                    Live logs enabled • Auto-refresh every 30s
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={CheckCircle2}
                    value={String(logs.filter(l => l.level === 'success' || l.level === 'info').length)}
                    label="Successful Calls"
                    colorClass="bg-success-50 text-success-500"
                />
                <StatCard
                    icon={XCircle}
                    value={String(logs.filter(l => l.level === 'error').length)}
                    label="Errors Today"
                    colorClass="bg-danger-50 text-danger-500"
                />
                <StatCard
                    icon={ArrowRightLeft}
                    value={String(logs.filter(l => (l.source || '').toLowerCase().includes('api')).length)}
                    label="API Calls (Page)"
                    colorClass="bg-primary-50 text-primary-500"
                />
                <StatCard
                    icon={Radio}
                    value={String(logs.filter(l => (l.source || '').toLowerCase().includes('webhook')).length)}
                    label="Webhooks (Page)"
                    colorClass="bg-primary-50 text-primary-500"
                />
            </div>

            {/* Tabs */}
            <div className="flex bg-surface-50 p-1 rounded-xl border border-surface-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                            activeTab === tab.id
                                ? "bg-primary-500 text-white shadow-sm"
                                : "text-surface-900/60 hover:text-surface-900"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <section className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <Select
                        label="Time Range"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option>All Types</option>
                        <option>Last hour</option>
                        <option>Last 24 hours</option>
                    </Select>
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Statuses</option>
                        <option>Success</option>
                        <option>Warning</option>
                        <option>Error</option>
                    </Select>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-surface-900 uppercase tracking-wider">Search</label>
                        <Input
                            placeholder="Search message"
                            icon={<Search className="h-4 w-4" />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select
                        label="Log Level"
                        value={logLevel}
                        onChange={(e) => setLogLevel(e.target.value)}
                    >
                        <option>All Level</option>
                        <option>Info</option>
                        <option>Warning</option>
                        <option>Error</option>
                    </Select>
                </div>
            </section>

            {/* Logs Table */}
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-surface-50 border-b border-surface-200">
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px] w-1/3">Timestamp</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px] w-1/3">Event Type</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px] w-1/3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-surface-500">
                                    Loading logs...
                                </td>
                            </tr>
                        ) : filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-12 text-center text-surface-500">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log, index) => (
                                <tr key={index} className="hover:bg-surface-50/50 transition-colors">
                                    <td className="px-6 py-4 text-surface-600 font-medium whitespace-nowrap">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-surface-900 whitespace-nowrap">
                                        {log.source || log.category || "System"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {log.level === "success" && <CheckCircle2 className="h-4 w-4 text-success-500 shrink-0" />}
                                            {log.level === "info" && <CheckCircle2 className="h-4 w-4 text-primary-500 shrink-0" />}
                                            {log.level === "warning" && <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0" />}
                                            {log.level === "error" && <XCircle className="h-4 w-4 text-danger-500 shrink-0" />}
                                            <span className="text-surface-600 font-medium leading-relaxed">{log.message || log.metadata?.status}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
                    <p className="text-xs text-surface-900/70">
                        {totalLogs > 0
                            ? `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalLogs)} of ${totalLogs} logs`
                            : "No logs"}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1 hover:bg-surface-100 rounded text-surface-900/60 disabled:opacity-50"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <span className="text-xs font-medium text-surface-600">Page {page}</span>
                        <button
                            className="p-1 hover:bg-surface-100 rounded text-surface-900/60 disabled:opacity-50"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page * limit >= totalLogs}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
