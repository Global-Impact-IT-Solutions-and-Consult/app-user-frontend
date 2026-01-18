import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
    ArrowLeft,
    Upload,
    Send,
    FileJson,
    Download,
    CheckCircle2,
    Clock,
    Zap,
    List
} from "lucide-react";
import { cn } from "../lib/utils";
import { useReceiptStore } from "../store/receiptStore";

export default function InvoiceDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const {
        currentReceipt,
        currentReceiptLogs,
        isLoading,
        fetchReceipt,
        fetchReceiptLogs,
        downloadReceipt
    } = useReceiptStore();

    React.useEffect(() => {
        if (id) {
            fetchReceipt(id);
            fetchReceiptLogs(id);
        }
    }, [id, fetchReceipt, fetchReceiptLogs]);

    const handleDownload = async (format: string) => {
        if (id) {
            try {
                await downloadReceipt(id, format);
            } catch (error) {
                // Error handling handled by store or global error boundary
                console.error("Download failed:", error);
            }
        }
    };

    if (isLoading && !currentReceipt) {
        return <div className="p-8 text-center text-surface-600">Loading invoice details...</div>;
    }

    if (!currentReceipt && !isLoading) {
        return <div className="p-8 text-center text-red-500">Invoice not found or failed to load.</div>;
    }

    // Fallback for safety if currentReceipt is null during initial render even if not loading
    const invoice = currentReceipt || {
        id: id || "Unknown",
        receiptNumber: "N/A",
        totalAmount: 0,
        currency: "NGN",
        issueDate: new Date().toISOString(),
        status: "Unknown",
        type: "sent",
        counterpartyName: "Unknown",
    };

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white rounded-lg border border-surface-200 transition-colors shadow-sm"
                    >
                        <ArrowLeft className="h-5 w-5 text-surface-600" />
                    </button>
                    <div className="space-y-0.5">
                        <h1 className="text-3xl font-bold text-surface-900 font-serif">Invoice Details</h1>
                        <p className="text-surface-400 text-sm">
                            Complete history and timeline of invoice events
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 h-11 px-6 font-bold border-surface-200" onClick={() => handleDownload('json')}>
                        <Upload className="h-4 w-4 text-primary-500" />
                        Export JSON
                    </Button>
                    {/* Clear logs functionality typically isn't for a single invoice unless it's a debug feature. Keeping placeholder or removing action if not supported by API */}
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-surface-900">{invoice.receiptNumber || invoice.id}</h2>
                                <div className="flex gap-2">
                                    <Badge variant={invoice.type === 'sent' ? 'primary' : 'success'} icon={<Send className="h-3 w-3" />}>
                                        {invoice.type === 'sent' ? 'Sent Invoice' : 'Received Invoice'}
                                    </Badge>
                                    <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>{invoice.status}</Badge>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm text-surface-400 font-medium">Total Amount</p>
                                <p className="text-4xl font-bold text-surface-900 font-serif">
                                    {invoice.currency} {invoice.totalAmount?.toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-surface-100 pt-8">
                            <div className="space-y-1">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Issue Date</p>
                                <p className="text-surface-900 font-bold">
                                    {invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1 text-right lg:text-left">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Due Date</p>
                                <p className="text-surface-900 font-bold">
                                    {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Currency</p>
                                <p className="text-surface-900 font-bold">{invoice.currency}</p>
                            </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="bg-surface-50 p-6 rounded-xl border border-surface-100 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white">
                                    {invoice.counterpartyName ? invoice.counterpartyName.charAt(0) : 'U'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-surface-900">{invoice.counterpartyName || 'Unknown Counterparty'}</h3>
                                    <p className="text-xs text-surface-400 font-medium">{invoice.type === 'sent' ? 'Buyer' : 'Supplier'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Logs from API */}
                    <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2 font-serif">
                            <List className="h-5 w-5 text-primary-500" />
                            Audit Logs & Timeline
                        </h2>

                        {currentReceiptLogs.length === 0 ? (
                            <p className="text-surface-400 text-sm">No activity logs found.</p>
                        ) : (
                            <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-100">
                                {currentReceiptLogs.map((log, i) => (
                                    <div key={i} className="relative pl-10 flex gap-4">
                                        <div className={cn("absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-white", "bg-primary-50 text-primary-500")}>
                                            <Clock className="h-3 w-3" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-sm text-surface-900">{log.eventType}</p>
                                            <div className="flex items-center gap-2 text-[10px] text-surface-400 font-medium">
                                                <Clock className="h-3 w-3" />
                                                {new Date(log.timestamp).toLocaleString()}
                                            </div>
                                            <p className="text-xs text-surface-500">{log.details || log.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Actions & Line Items) */}
                <div className="space-y-8">
                    {/* Quick Action */}
                    <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-surface-900 flex items-center gap-2 font-serif">
                            <Zap className="h-5 w-5 text-primary-500" />
                            Quick Action
                        </h2>
                        <div className="space-y-3">
                            {/* Transmit action - pending explicit endpoint, placeholder */}
                            <Button className="w-full gap-2 font-bold py-6">
                                <Send className="h-4 w-4" />
                                Transmit to {invoice.type === 'sent' ? 'Buyer' : 'Supplier'}
                            </Button>
                            <Button variant="outline" className="w-full gap-2 font-bold py-6 text-primary-500" onClick={() => handleDownload('json')}>
                                <FileJson className="h-4 w-4" />
                                View Raw JSON
                            </Button>
                            <Button variant="outline" className="w-full gap-2 font-bold py-6 text-primary-500" onClick={() => handleDownload('pdf')}>
                                <Download className="h-4 w-4" />
                                Download PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

