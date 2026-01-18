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
import { useReceiptStore } from "../store/receiptStore";

const tabs = [
    { label: "All Invoices", count: 10, id: "all" },
    { label: "Sent", count: 5, id: "sent" },
    { label: "Received", count: 5, id: "received" },
    { label: "Pending", count: 3, id: "pending" },
    { label: "Failed", count: 1, id: "failed" },
];



export default function Invoices() {
    const navigate = useNavigate();
    const {
        receipts,
        totalReceipts,
        isLoading,
        fetchReceipts
    } = useReceiptStore();

    const [activeTab, setActiveTab] = React.useState("all");
    const [searchQuery, setSearchQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("All Statuses");
    const [dateRange, setDateRange] = React.useState("All Time");
    const [page, setPage] = React.useState(1);
    const limit = 20;

    interface InvoiceParams {
        page: number;
        limit: number;
        search?: string;
        dateFrom?: string;
        [key: string]: unknown;
    }

    React.useEffect(() => {
        const params: InvoiceParams = {
            page,
            limit,
        };

        if (activeTab !== 'all') {
            // Type filtering Logic
        }

        if (searchQuery) {
            params.search = searchQuery;
        }

        if (statusFilter !== "All Statuses") {
            // Status filtering Logic
        }

        if (dateRange !== "All Time") {
            const now = new Date();
            if (dateRange === "Last 7 Days") {
                const past = new Date(now.setDate(now.getDate() - 7));
                params.dateFrom = past.toISOString();
            } else if (dateRange === "Last 30 Days") {
                const past = new Date(now.setDate(now.getDate() - 30));
                params.dateFrom = past.toISOString();
            }
        }

        fetchReceipts(params);
    }, [activeTab, searchQuery, statusFilter, dateRange, page, fetchReceipts]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("All Statuses");
        setDateRange("All Time");
        setActiveTab("all");
    };

    // Client-side filtering fallback
    const displayedReceipts = React.useMemo(() => {
        return receipts.filter(r => {
            if (activeTab === 'sent' && r.type !== 'sent') return false;
            if (activeTab === 'received' && r.type !== 'received') return false;
            if (activeTab === 'pending' && r.status !== 'processing') return false;
            if (activeTab === 'failed' && r.status !== 'failed') return false;

            if (statusFilter !== "All Statuses" && r.status !== statusFilter) return false;

            return true;
        });
    }, [receipts, activeTab, statusFilter]);

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
                    <div className="space-y-1.5 flex-[2] col-span-2">
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
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-surface-500">
                                    Loading invoices...
                                </td>
                            </tr>
                        ) : displayedReceipts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-surface-500">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            displayedReceipts.map((activity, index) => (
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
                                                variant={activity.type === "sent" ? "primary" : "success"}
                                                size="sm"
                                                className="font-medium"
                                                icon={activity.type === "sent" ? <Send className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                                            >
                                                {activity.type === "sent" ? "Sent" : "Received"}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-surface-600">{activity.receiptNumber || activity.id}</td>
                                    <td className="px-6 py-4 text-surface-600">
                                        {activity.issueDate ? new Date(activity.issueDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-surface-600">{activity.counterpartyName || 'Unknown'}</td>
                                    <td className="px-6 py-4 text-surface-900">
                                        {activity.currency} {activity.totalAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="primary" size="sm">
                                            {activity.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <button className="text-primary-500 font-medium hover:underline">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
                    <p className="text-xs text-surface-900/70">
                        {totalReceipts > 0
                            ? `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, totalReceipts)} of ${totalReceipts} invoices`
                            : "No invoices"}
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
                            disabled={page * limit >= totalReceipts}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

