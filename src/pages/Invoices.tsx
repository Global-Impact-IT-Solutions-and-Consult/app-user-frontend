import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
    Plus,
    Upload,
    Search,
    Send,
    Download,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";

const tabs = [
    { label: "All Invoices", count: 10, id: "all" },
    { label: "Sent", count: 5, id: "sent" },
    { label: "Received", count: 5, id: "received" },
    { label: "Pending", count: 3, id: "pending" },
    { label: "Failed", count: 1, id: "failed" },
];

const mockInvoices = [
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-08",
        counterparty: "Global Supplies Ltd. (Buyer)",
        amount: "₦1,250,000",
        status: "Cleared",
        statusVariant: "success" as const,
        action: "Transmit"
    },
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-07",
        counterparty: "Tech Innovations (Buyer)",
        amount: "₦850,450",
        status: "Sent to NRS",
        statusVariant: "primary" as const,
        action: "Monitor"
    },
    {
        type: "Received",
        icon: Download,
        id: "INV-2025-654321",
        date: "2025-11-07",
        counterparty: "Raw Materials Inc. (Supplier)",
        amount: "₦3,450,000",
        status: "Downloaded",
        statusVariant: "primary" as const,
        action: "View"
    },
    {
        type: "Received",
        icon: Download,
        id: "INV-2025-654321",
        date: "2025-11-07",
        counterparty: "Raw Materials Inc. (Supplier)",
        amount: "₦3,450,000",
        status: "Processing",
        statusVariant: "warning" as const,
        action: "Acknowledge"
    },
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-08",
        counterparty: "Global Supplies Ltd. (Buyer)",
        amount: "₦1,250,000",
        status: "Cleared",
        statusVariant: "success" as const,
        action: "Transmit"
    },
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-08",
        counterparty: "Global Supplies Ltd. (Buyer)",
        amount: "₦1,250,000",
        status: "Cleared",
        statusVariant: "success" as const,
        action: "Transmit"
    },
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-07",
        counterparty: "Tech Innovations (Buyer)",
        amount: "₦850,450",
        status: "Sent to NRS",
        statusVariant: "primary" as const,
        action: "Monitor"
    },
    {
        type: "Received",
        icon: Download,
        id: "INV-2025-654321",
        date: "2025-11-07",
        counterparty: "Raw Materials Inc. (Supplier)",
        amount: "₦3,450,000",
        status: "Processing",
        statusVariant: "warning" as const,
        action: "Acknowledge"
    },
    {
        type: "Sent",
        icon: Send,
        id: "INV-2025-789012",
        date: "2025-11-07",
        counterparty: "Tech Innovations (Buyer)",
        amount: "₦850,450",
        status: "Sent to NRS",
        statusVariant: "primary" as const,
        action: "Monitor"
    },
    {
        type: "Received",
        icon: Download,
        id: "INV-2025-654321",
        date: "2025-11-07",
        counterparty: "Raw Materials Inc. (Supplier)",
        amount: "₦3,450,000",
        status: "Processing",
        statusVariant: "warning" as const,
        action: "Acknowledge"
    }
];

export default function Invoices() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [typeFilter, setTypeFilter] = React.useState("All Types");
    const [statusFilter, setStatusFilter] = React.useState("All Statuses");
    const [dateRange, setDateRange] = React.useState("All Time");

    // Dynamic counts
    const counts = React.useMemo(() => ({
        all: mockInvoices.length,
        sent: mockInvoices.filter(inv => inv.type === "Sent").length,
        received: mockInvoices.filter(inv => inv.type === "Received").length,
        pending: mockInvoices.filter(inv => inv.status === "Processing" || inv.status === "Sent to NRS").length,
        failed: mockInvoices.filter(inv => inv.status === "Failed").length, // Added failed status for logic
    }), []);

    const filteredInvoices = React.useMemo(() => {
        return mockInvoices.filter((inv) => {
            // 1. Tab filtering
            if (activeTab === "sent" && inv.type !== "Sent") return false;
            if (activeTab === "received" && inv.type !== "Received") return false;
            if (activeTab === "pending" && !(inv.status === "Processing" || inv.status === "Sent to NRS")) return false;
            if (activeTab === "failed" && inv.status !== "Failed") return false;

            // 2. Select filters
            if (typeFilter !== "All Types" && inv.type !== typeFilter) return false;
            if (statusFilter !== "All Statuses" && inv.status !== statusFilter) return false;

            // 3. Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    inv.id.toLowerCase().includes(query) ||
                    inv.counterparty.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [activeTab, typeFilter, statusFilter, searchQuery]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setTypeFilter("All Types");
        setStatusFilter("All Statuses");
        setDateRange("All Time");
        setActiveTab("all");
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header omitted for brevity in chunk but should match */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-surface-900 font-serif">Invoices</h1>
                    <p className="text-surface-900/70 text-sm">
                        Manage all sent and received invoices
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200">
                        <Upload className="h-4 w-4 text-primary-500" />
                        Export
                    </Button>
                    <Button className="gap-2 h-11 px-6 font-bold">
                        <Plus className="h-4 w-4" />
                        Create Invoice
                    </Button>
                </div>
            </header>

            {/* Filters */}
            <section className="bg-white p-6 rounded-2xl border border-surface-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <Select
                        label="Type"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option>All Types</option>
                        <option>Sent</option>
                        <option>Received</option>
                    </Select>
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option>All Statuses</option>
                        <option>Cleared</option>
                        <option>Sent to NRS</option>
                        <option>Processing</option>
                        <option>Downloaded</option>
                    </Select>
                    <Select
                        label="Date Range"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option>All Time</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                    </Select>
                    <div className="space-y-1.5 flex-[2]">
                        <label className="text-sm font-medium text-surface-900 uppercase tracking-wider">Search</label>
                        <div className="flex gap-3">
                            <Input
                                placeholder="Invoice ID or Counterparty"
                                icon={<Search className="h-4 w-4" />}
                                className="flex-1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Button
                                variant="outline"
                                className="h-11 border-surface-200 font-bold whitespace-nowrap text-primary-500"
                                onClick={handleClearFilters}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-surface-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 py-3 px-1 border-1 transition-all text-sm font-bold",
                            activeTab === tab.id
                                ? "border-primary-500 text-primary-500 bg-primary-50/50 px-4 rounded-full"
                                : "border-gray-100 text-surface-900/60 hover:text-surface-900 px-4 rounded-full"
                        )}
                    >
                        <span className={cn(
                            "flex items-center justify-center h-5 px-1.5 rounded-full text-[10px]",
                            activeTab === tab.id ? "bg-primary-500 text-white" : "bg-surface-100 text-surface-900"
                        )}>
                            {counts[tab.id as keyof typeof counts]}
                        </span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-surface-50 border-b border-surface-200">
                            <th className="px-6 py-4 w-4">
                                <input type="checkbox" className="rounded border-surface-300" />
                            </th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Type</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Invoice ID</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Date</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Counterparty</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Amount</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Status</th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {filteredInvoices.map((activity, index) => (
                            <tr
                                key={index}
                                className="hover:bg-surface-50/50 transition-colors cursor-pointer"
                                onClick={() => navigate(`/dashboard/invoices/${activity.id}`)}
                            >
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-surface-300" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant={activity.type === "Sent" ? "primary" : "success"}
                                            size="sm"
                                            className="font-medium"
                                            icon={<activity.icon className="h-3 w-3" />}
                                        >
                                            {activity.type}
                                        </Badge>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-surface-600">{activity.id}</td>
                                <td className="px-6 py-4 text-surface-600">{activity.date}</td>
                                <td className="px-6 py-4 text-surface-600">{activity.counterparty}</td>
                                <td className="px-6 py-4 text-surface-900">{activity.amount}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={activity.statusVariant} size="sm">
                                        {activity.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                    <button className="text-primary-500 font-medium hover:underline">
                                        {activity.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
                    <p className="text-xs text-surface-900/70">Showing 1-{filteredInvoices.length} of {filteredInvoices.length} invoices</p>
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

