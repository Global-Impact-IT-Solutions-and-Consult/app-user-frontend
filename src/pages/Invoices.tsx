import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import {
    Upload,
    Search,
    Send,
    Download,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "../lib/utils";
import { useCompanyStore } from "../store/companyStore";
import { useReceiptStore } from "../store/receiptStore";
import { useZohoBooksStore, type ZohoJob } from "../store/zohoBooksStore";
import { useQuickBooksStore, type QuickBooksJob } from "../store/quickBooksStore";
import { useXeroStore, type XeroJob } from "../store/xeroStore";
import { getString, getNumber, sourceName } from "../lib/providerInvoice";

const tabs = [
    { label: "All Invoices", id: "all" },
    { label: "Sent", id: "sent" },
    { label: "Received", id: "received" },
    { label: "Pending", id: "pending" },
    { label: "Failed", id: "failed" },
];

const statusOptions = [
    "All Statuses",
    "Imported",
    "Submitted",
    "Processing",
    "Processed",
    "Completed",
    "Failed",
];

type InvoiceRow = {
    id: string;
    receiptId?: string | null;
    source: "receipt" | "zoho-books" | "quickbooks" | "xero";
    type: "sent" | "received";
    invoiceId: string;
    issueDate: string | null;
    counterpartyName: string;
    totalAmount: number | null;
    currency: string;
    status: string;
    updatedAt: string | null;
    route?: string;
};

type ReceiptLike = {
    id: string;
    receiptNumber?: string;
    issueDate?: string;
    totalAmount?: number;
    currency?: string;
    status?: string;
    type?: "sent" | "received";
    counterpartyName?: string;
};

function normalizeStatus(status: string) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function statusVariant(status: string): "primary" | "success" | "warning" | "danger" | "gray" {
    const value = status.toLowerCase();
    if (value === "failed") return "danger";
    if (["completed", "processed"].includes(value)) return "success";
    if (["processing", "writeback_pending", "imported"].includes(value)) return "warning";
    if (value === "submitted") return "primary";
    return "gray";
}

function normalizeReceipt(receipt: ReceiptLike): InvoiceRow {
    return {
        id: `receipt:${receipt.id}`,
        receiptId: receipt.id,
        source: "receipt",
        type: receipt.type || "received",
        invoiceId: receipt.receiptNumber || receipt.id,
        issueDate: receipt.issueDate || null,
        counterpartyName: receipt.counterpartyName || "Unknown",
        totalAmount: typeof receipt.totalAmount === "number" ? receipt.totalAmount : null,
        currency: receipt.currency || "",
        status: receipt.status || "received",
        updatedAt: receipt.issueDate || null,
        route: `/dashboard/invoices/${receipt.id}`,
    };
}

// sourceName() only knows about the three provider sources; receipts get their own label here.
function displaySourceName(source: InvoiceRow["source"]) {
    return source === "receipt" ? "Receipt Service" : sourceName(source);
}

function normalizeProviderJob(job: ZohoJob | QuickBooksJob | XeroJob, source: "zoho-books" | "quickbooks" | "xero"): InvoiceRow {
    const payload = job.sourcePayload || null;
    const providerInvoiceId =
        source === "zoho-books"
            ? (job as ZohoJob).zohoInvoiceId
            : source === "quickbooks"
                ? (job as QuickBooksJob).quickbooksInvoiceId
                : (job as XeroJob).xeroInvoiceId;
    const invoiceId =
        source === "zoho-books"
            ? (job as ZohoJob).zohoInvoiceNumber || (job as ZohoJob).zohoInvoiceId
            : source === "quickbooks"
                ? (job as QuickBooksJob).quickbooksInvoiceNumber || (job as QuickBooksJob).quickbooksInvoiceId
                : (job as XeroJob).xeroInvoiceNumber || (job as XeroJob).xeroInvoiceId;

    return {
        id: `${source}:${job.id}`,
        receiptId: job.receiptId,
        source,
        type: "received",
        invoiceId,
        issueDate: getString(payload, ["date", "Date", "TxnDate", "InvoiceDate", "invoice_date"]) || job.createdAt || null,
        counterpartyName: getString(payload, ["customer_name", "CustomerRef", "Contact", "contact_name", "Name"]) || sourceName(source),
        totalAmount: getNumber(payload, ["total", "TotalAmt", "Total", "AmountDue", "amount_due"]),
        currency: getString(payload, ["currency_code", "CurrencyRef", "CurrencyCode"]) || "",
        status: job.status,
        updatedAt: job.updatedAt,
        route: job.receiptId
            ? `/dashboard/invoices/${job.receiptId}`
            : providerInvoiceId
                ? `/dashboard/invoices/provider/${source}/${providerInvoiceId}`
                : undefined,
    };
}

function formatAmount(row: InvoiceRow) {
    if (row.totalAmount === null) return "—";
    return `${row.currency} ${row.totalAmount.toLocaleString()}`.trim();
}

function getDateFromRange(dateRange: string) {
    const now = new Date();
    if (dateRange === "Last 7 Days") {
        return new Date(now.setDate(now.getDate() - 7));
    }
    if (dateRange === "Last 30 Days") {
        return new Date(now.setDate(now.getDate() - 30));
    }
    return null;
}

export default function Invoices() {
    const navigate = useNavigate();
    const { currentCompany } = useCompanyStore();
    const {
        receipts,
        isLoading,
        fetchReceipts
    } = useReceiptStore();
    const { jobs: zohoJobs, fetchJobs: fetchZohoJobs } = useZohoBooksStore();
    const { jobs: quickBooksJobs, fetchJobs: fetchQuickBooksJobs } = useQuickBooksStore();
    const { jobs: xeroJobs, fetchJobs: fetchXeroJobs } = useXeroStore();

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

        if (searchQuery) {
            params.search = searchQuery;
        }

        const dateFrom = getDateFromRange(dateRange);
        if (dateFrom) {
            params.dateFrom = dateFrom.toISOString();
        }

        fetchReceipts(params);
    }, [searchQuery, dateRange, page, fetchReceipts]);

    React.useEffect(() => {
        if (!currentCompany?.id) return;
        fetchZohoJobs(currentCompany.id, 1, 100);
        fetchQuickBooksJobs(currentCompany.id, 1, 100);
        fetchXeroJobs(currentCompany.id, 1, 100);
    }, [currentCompany?.id, fetchQuickBooksJobs, fetchXeroJobs, fetchZohoJobs]);

    const handleClearFilters = () => {
        setSearchQuery("");
        setStatusFilter("All Statuses");
        setDateRange("All Time");
        setActiveTab("all");
        setPage(1);
    };

    const displayedReceipts = React.useMemo(() => {
        const rowsById = new Map<string, InvoiceRow>();
        const receiptRows = receipts.map((receipt) => normalizeReceipt(receipt));
        const providerRows = [
            ...zohoJobs.map((job) => normalizeProviderJob(job, "zoho-books")),
            ...quickBooksJobs.map((job) => normalizeProviderJob(job, "quickbooks")),
            ...xeroJobs.map((job) => normalizeProviderJob(job, "xero")),
        ];

        for (const row of [...receiptRows, ...providerRows]) {
            const key = row.receiptId || row.id;
            if (!rowsById.has(key)) rowsById.set(key, row);
        }

        return Array.from(rowsById.values()).filter(row => {
            const normalizedStatus = row.status.toLowerCase();
            const dateFrom = getDateFromRange(dateRange);
            if (activeTab === "sent" && row.type !== "sent") return false;
            if (activeTab === "received" && row.type !== "received") return false;
            if (activeTab === "pending" && !["processing", "imported", "submitted", "writeback_pending"].includes(normalizedStatus)) return false;
            if (activeTab === "failed" && normalizedStatus !== "failed") return false;
            if (dateFrom && new Date(row.updatedAt || row.issueDate || 0) < dateFrom) return false;

            if (statusFilter !== "All Statuses" && normalizeStatus(row.status) !== statusFilter) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (!`${row.invoiceId} ${row.counterpartyName} ${displaySourceName(row.source)}`.toLowerCase().includes(q)) return false;
            }

            return true;
        }).sort((a, b) => new Date(b.updatedAt || b.issueDate || 0).getTime() - new Date(a.updatedAt || a.issueDate || 0).getTime());
    }, [receipts, zohoJobs, quickBooksJobs, xeroJobs, activeTab, statusFilter, searchQuery, dateRange]);

    const displayedTotal = displayedReceipts.length;
    const pageRows = displayedReceipts.slice((page - 1) * limit, page * limit);

    React.useEffect(() => {
        setPage(1);
    }, [activeTab, statusFilter, searchQuery, dateRange]);

    return (
        <div className="p-8 space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-surface-900 font-serif">Invoices</h1>
                    <p className="text-surface-900/70 text-sm">
                        Manage synced, submitted, and processed invoices
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200">
                        <Upload className="h-4 w-4 text-primary-500" />
                        Export
                    </Button>
                </div>
            </header>

            <section className="bg-white p-6 rounded-2xl border border-surface-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <Select
                        label="Status"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        {statusOptions.map((option) => (
                            <option key={option}>{option}</option>
                        ))}
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
                                placeholder="Invoice ID, counterparty, or source"
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

            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-surface-50 border-b border-surface-200">
                            <th className="px-6 py-4 w-4">
                                <input type="checkbox" className="rounded border-surface-300" />
                            </th>
                            <th className="px-6 py-4 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Source</th>
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
                        ) : pageRows.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-12 text-center text-surface-500">
                                    No invoices found.
                                </td>
                            </tr>
                        ) : (
                            pageRows.map((activity) => (
                                <tr
                                    key={activity.id}
                                    className={cn(
                                        "hover:bg-surface-50/50 transition-colors",
                                        activity.route && "cursor-pointer"
                                    )}
                                    onClick={() => activity.route && navigate(activity.route)}
                                >
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" className="rounded border-surface-300" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant={activity.source === "receipt" ? "success" : "primary"}
                                                size="sm"
                                                className="font-medium"
                                                icon={activity.type === "sent" ? <Send className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                                            >
                                                {displaySourceName(activity.source)}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-surface-600">{activity.invoiceId}</td>
                                    <td className="px-6 py-4 text-surface-600">
                                        {activity.issueDate ? new Date(activity.issueDate).toLocaleDateString() : "N/A"}
                                    </td>
                                    <td className="px-6 py-4 text-surface-600">{activity.counterpartyName}</td>
                                    <td className="px-6 py-4 text-surface-900">{formatAmount(activity)}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={statusVariant(activity.status)} size="sm">
                                            {normalizeStatus(activity.status)}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                        {activity.route ? (
                                            <button
                                                className="text-primary-500 font-medium hover:underline"
                                                onClick={() => navigate(activity.route!)}
                                            >
                                                View
                                            </button>
                                        ) : (
                                            <span className="text-xs text-surface-900/50">Job only</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="px-6 py-4 bg-surface-50 border-t border-surface-200 flex items-center justify-between">
                    <p className="text-xs text-surface-900/70">
                        {displayedTotal > 0
                            ? `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, displayedTotal)} of ${displayedTotal} invoices`
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
                            disabled={page * limit >= displayedTotal}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
