import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useCompanyStore } from "../store/companyStore";
import { useZohoBooksStore } from "../store/zohoBooksStore";
import { useQuickBooksStore } from "../store/quickBooksStore";
import { useXeroStore } from "../store/xeroStore";
import { getString, getNumber, getLineItems, sourceName, type ProviderSource } from "../lib/providerInvoice";

function statusVariant(status: string): "primary" | "success" | "warning" | "danger" | "gray" {
    const value = status.toLowerCase();
    if (value.includes("void") || value.includes("overdue") || value === "failed") return "danger";
    if (value.includes("paid") || value.includes("closed") || value === "completed") return "success";
    if (value.includes("draft") || value.includes("pending")) return "warning";
    return "gray";
}

export default function ProviderInvoiceDetail() {
    const { service, invoiceId } = useParams<{ service: string; invoiceId: string }>();
    const navigate = useNavigate();
    const { currentCompany } = useCompanyStore();
    const [showRaw, setShowRaw] = React.useState(false);

    const source = service as ProviderSource;
    const zoho = useZohoBooksStore();
    const quickbooks = useQuickBooksStore();
    const xero = useXeroStore();

    const { currentInvoice: invoice, isLoadingInvoice: isLoading, invoiceError: error, fetchInvoice } =
        source === "zoho-books" ? zoho : source === "quickbooks" ? quickbooks : xero;

    const companyId = currentCompany?.id;

    React.useEffect(() => {
        if (!companyId || !invoiceId) return;
        fetchInvoice(companyId, invoiceId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyId, invoiceId, source]);

    if (!companyId) {
        return (
            <div className="p-8 text-center text-surface-600">
                No company selected yet. Complete onboarding to view invoices.
            </div>
        );
    }

    if (isLoading && !invoice) {
        return <div className="p-8 text-center text-surface-600">Loading invoice details...</div>;
    }

    if (!invoice) {
        return (
            <div className="p-8 space-y-6">
                <button
                    onClick={() => navigate("/dashboard/invoices")}
                    className="flex items-center gap-2 text-sm font-medium text-surface-900/70 hover:text-surface-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Invoices
                </button>
                <p className="text-center text-red-500">{error || "Invoice not found or failed to load."}</p>
            </div>
        );
    }

    const invoiceNumber = getString(invoice, ["invoice_number", "DocNumber", "InvoiceNumber"]) || invoiceId || "";
    const status = getString(invoice, ["status", "TxnStatus", "Status"]) || "Unknown";
    const customerName = getString(invoice, ["customer_name", "CustomerRef", "Contact"]) || "Unknown";
    const issueDate = getString(invoice, ["date", "Date", "TxnDate", "InvoiceDate"]);
    const dueDate = getString(invoice, ["due_date", "DueDate"]);
    const total = getNumber(invoice, ["total", "TotalAmt", "Total"]);
    const currency = getString(invoice, ["currency_code", "CurrencyRef", "CurrencyCode"]);
    const lineItems = getLineItems(invoice, source);

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm font-medium text-surface-900/70 hover:text-surface-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                    <header className="flex justify-between items-start">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-bold text-surface-900 font-serif">
                                {invoiceNumber || "Invoice"}
                            </h1>
                            <div className="flex items-center gap-2">
                                <Badge variant="gray" size="sm">{sourceName(source)}</Badge>
                                <Badge variant={statusVariant(status)} size="sm">{status}</Badge>
                            </div>
                        </div>
                        {total !== null && (
                            <div className="text-right space-y-1">
                                <p className="text-sm text-surface-400 font-medium">Total Amount</p>
                                <p className="text-3xl font-bold text-surface-900 font-serif">
                                    {currency} {total.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </header>

                    <div className="grid grid-cols-2 gap-6 border-t border-surface-100 pt-6 text-sm">
                        <div className="space-y-1">
                            <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Customer</p>
                            <p className="text-surface-900 font-bold">{customerName || "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Currency</p>
                            <p className="text-surface-900 font-bold">{currency || "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Issue Date</p>
                            <p className="text-surface-900 font-bold">
                                {issueDate ? new Date(issueDate).toLocaleDateString() : "—"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Due Date</p>
                            <p className="text-surface-900 font-bold">
                                {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}
                            </p>
                        </div>
                    </div>

                    {lineItems.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-sm font-bold text-surface-900">Line Items</h2>
                            <div className="overflow-x-auto rounded-xl border border-surface-100">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-surface-50 border-b border-surface-100">
                                            <th className="px-4 py-3 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Description</th>
                                            <th className="px-4 py-3 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Qty</th>
                                            <th className="px-4 py-3 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Rate</th>
                                            <th className="px-4 py-3 font-bold text-surface-900/70 uppercase tracking-wider text-[10px]">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-surface-100">
                                        {lineItems.map((item, i) => (
                                            <tr key={i}>
                                                <td className="px-4 py-3 text-surface-900">
                                                    {getString(item, ["description", "Description", "name"]) || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-surface-600">
                                                    {getNumber(item, ["quantity", "Quantity", "Qty"]) ?? "—"}
                                                </td>
                                                <td className="px-4 py-3 text-surface-600">
                                                    {getNumber(item, ["rate", "UnitAmount", "unit_price"]) ?? "—"}
                                                </td>
                                                <td className="px-4 py-3 text-surface-900 font-medium">
                                                    {getNumber(item, ["item_total", "Amount", "LineAmount"]) ?? "—"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 border-t border-surface-100 pt-6">
                        <Button
                            variant="outline"
                            className="gap-2 text-xs font-bold border-surface-200"
                            onClick={() => setShowRaw((prev) => !prev)}
                        >
                            {showRaw ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            {showRaw ? "Hide Raw JSON" : "View Raw JSON"}
                        </Button>
                        {showRaw && (
                            <pre className="max-h-96 overflow-auto rounded-xl bg-surface-50 border border-surface-100 p-4 text-xs text-surface-900/80">
                                {JSON.stringify(invoice, null, 2)}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
