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

const tabs = [
    { label: "All Logs", id: "all" },
    { label: "API Calls", id: "api" },
    { label: "Webhooks", id: "webhooks" },
    { label: "Systems", id: "systems" },
    { label: "Errors", id: "errors" },
];

const mockLogs = [
    {
        timestamp: "2025-11-08 14:23:45",
        type: "API Call",
        status: "Invoice submitted successfully to NRS for clearance",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:23:45",
        type: "Webhook",
        status: "Invoice cleared by NRS, status: TRANSMITTING",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:15:30",
        type: "System",
        status: "Database connection pool nearing capacity (85%)",
        statusType: "warning"
    },
    {
        timestamp: "2025-11-08 14:23:45",
        type: "API Call",
        status: "Invoice submitted successfully to NRS for clearance",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:23:45",
        type: "API Call",
        status: "Invoice submitted successfully to NRS for clearance",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:15:30",
        type: "Error",
        status: "Failed to decrypt invoice data: Invalid encryption key",
        statusType: "error"
    },
    {
        timestamp: "2025-11-08 14:23:45",
        type: "API Call",
        status: "Invoice submitted successfully to NRS for clearance",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:15:30",
        type: "API Call",
        status: "Validation failed: Missing required field \"business_id\"",
        statusType: "error"
    },
    {
        timestamp: "2025-11-08 14:23:45",
        type: "API Call",
        status: "Invoice submitted successfully to NRS for clearance",
        statusType: "success"
    },
    {
        timestamp: "2025-11-08 14:15:30",
        type: "API Call",
        status: "Database connection pool nearing capacity (85%)",
        statusType: "warning"
    }
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
    const [activeTab, setActiveTab] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [timeRange, setTimeRange] = React.useState("All Types");
    const [statusFilter, setStatusFilter] = React.useState("All Statuses");
    const [logLevel, setLogLevel] = React.useState("All Level");

    const filteredLogs = React.useMemo(() => {
        return mockLogs.filter((log) => {
            // 1. Tab filtering
            if (activeTab === "api" && log.type !== "API Call") return false;
            if (activeTab === "webhooks" && log.type !== "Webhook") return false;
            if (activeTab === "systems" && log.type !== "System") return false;
            if (activeTab === "errors" && log.statusType !== "error") return false;

            // 2. Select filters
            if (statusFilter !== "All Statuses" && log.statusType !== statusFilter.toLowerCase()) return false;
            // Note: Log level implementation depends on statusType for this mock
            if (logLevel !== "All Level" && log.statusType !== logLevel.toLowerCase()) return false;

            // 3. Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    log.status.toLowerCase().includes(query) ||
                    log.type.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [activeTab, searchQuery, statusFilter, logLevel]);

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
                    <Button className="gap-2 h-11 px-6 font-bold">
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
                    value="1,247"
                    label="Successful Calls"
                    colorClass="bg-success-50 text-success-500"
                />
                <StatCard
                    icon={XCircle}
                    value="12"
                    label="Errors Today"
                    colorClass="bg-danger-50 text-danger-500"
                />
                <StatCard
                    icon={ArrowRightLeft}
                    value="89"
                    label="API Calls (24h)"
                    colorClass="bg-primary-50 text-primary-500"
                />
                <StatCard
                    icon={Radio}
                    value="156"
                    label="Webhooks Received"
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
                        {filteredLogs.map((log, index) => (
                            <tr key={index} className="hover:bg-surface-50/50 transition-colors">
                                <td className="px-6 py-4 text-surface-600 font-medium whitespace-nowrap">{log.timestamp}</td>
                                <td className="px-6 py-4 text-surface-900 whitespace-nowrap">{log.type}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {log.statusType === "success" && <CheckCircle2 className="h-4 w-4 text-success-500 shrink-0" />}
                                        {log.statusType === "warning" && <AlertTriangle className="h-4 w-4 text-warning-500 shrink-0" />}
                                        {log.statusType === "error" && <XCircle className="h-4 w-4 text-danger-500 shrink-0" />}
                                        <span className="text-surface-600 font-medium leading-relaxed">{log.status}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
                    <p className="text-xs text-surface-900/70">Showing 1-{filteredLogs.length} of {filteredLogs.length} logs</p>
                    <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-surface-100 rounded text-surface-900/60">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button className="h-7 w-7 flex items-center justify-center rounded bg-primary-500 text-white text-xs font-bold shadow-sm">1</button>
                        <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-surface-100 text-surface-600 text-xs font-medium">2</button>
                        <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-surface-100 text-surface-600 text-xs font-medium">3</button>
                        <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-surface-100 text-surface-600 text-xs font-medium">4</button>
                        <button className="h-7 w-7 flex items-center justify-center rounded hover:bg-surface-100 text-surface-600 text-xs font-medium">5</button>
                        <button className="p-1 hover:bg-surface-100 rounded text-surface-900/60">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
