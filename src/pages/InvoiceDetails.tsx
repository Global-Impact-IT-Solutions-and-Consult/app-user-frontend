import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
    ArrowLeft,
    Upload,
    Trash2,
    Send,
    FileJson,
    Download,
    CheckCircle2,
    Clock,
    Zap,
    List
} from "lucide-react";
import { cn } from "../lib/utils";

export default function InvoiceDetails() {
    const navigate = useNavigate();
    const { id } = useParams();

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm space-y-8">
                        <div className="flex justify-between items-start">
                            <div className="space-y-4">
                                <h2 className="text-2xl font-bold text-surface-900">{id || "INV-2025-789012"}</h2>
                                <div className="flex gap-2">
                                    <Badge variant="primary" icon={<Send className="h-3 w-3" />}>Sent Invoice</Badge>
                                    <Badge variant="success" icon={<CheckCircle2 className="h-3 w-3" />}>Cleared by NRS</Badge>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-sm text-surface-400 font-medium">Total Amount</p>
                                <p className="text-4xl font-bold text-surface-900 font-serif">₦1,250,000</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 border-t border-surface-100 pt-8">
                            <div className="space-y-1">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Issue Date</p>
                                <p className="text-surface-900 font-bold">2025-11-08</p>
                            </div>
                            <div className="space-y-1 text-right lg:text-left">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Due Date</p>
                                <p className="text-surface-900 font-bold">2025-12-08</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Currency</p>
                                <p className="text-surface-900 font-bold">NGN (Nigerian Naira)</p>
                            </div>
                            <div className="space-y-1 text-right lg:text-left">
                                <p className="text-xs text-surface-400 font-bold uppercase tracking-wider">Tax Amount</p>
                                <p className="text-surface-900 font-bold">₦125,000 (VAT 10%)</p>
                            </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="bg-surface-50 p-6 rounded-xl border border-surface-100 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center font-bold text-white">
                                    GS
                                </div>
                                <div>
                                    <h3 className="font-bold text-surface-900">Global Supplies Ltd.</h3>
                                    <p className="text-xs text-surface-400 font-medium">Buyer • TIN: 12345678-0001</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Business ID</p>
                                    <p className="text-sm text-surface-900 font-bold">NG-APP-1234-GLOB</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Email</p>
                                    <p className="text-sm text-surface-900 font-bold">accounts@globalsupplies.com</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="text-sm text-surface-900 font-bold">+234 801 234 5678</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">Address</p>
                                    <p className="text-sm text-surface-900 font-bold">Lagos Business District, Nigeria</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2 font-serif">
                            <List className="h-5 w-5 text-primary-500" />
                            Invoice Timeline
                        </h2>

                        <div className="space-y-8 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-100">
                            {[
                                { title: "Invoice Created", date: "2025-11-08 09:30:00", status: "Invoice Created", icon: CheckCircle2, color: "text-success-500", bg: "bg-success-50" },
                                { title: "Pre-flight Validation", date: "2025-11-08 09:35:22", status: "Invoice validated against NRS schema. All required fields present.", icon: CheckCircle2, color: "text-success-500", bg: "bg-success-50" },
                                { title: "Submitted to NRS", date: "2025-11-08 09:36:45", status: "Invoice sent to NRS for fiscalization via POST /api/v1/invoice/sign", icon: Send, color: "text-primary-500", bg: "bg-primary-50" },
                                { title: "Cleared by NRS", date: "2025-11-08 10:15:30", status: "NRS completed fiscal clearance. Invoice is ready for transmission.", icon: CheckCircle2, color: "text-success-500", bg: "bg-success-50" },
                                { title: "Ready for Transmission", date: "2025-11-08 10:20:00", status: "Invoice cleared and awaiting transmission to buyer", icon: Clock, color: "text-warning-500", bg: "bg-warning-50" },
                            ].map((item, i) => (
                                <div key={i} className="relative pl-10 flex gap-4">
                                    <div className={cn("absolute left-0 top-1 h-6 w-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-4 ring-white", item.bg, item.color)}>
                                        <item.icon className="h-3 w-3" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm text-surface-900">{item.title}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-surface-400 font-medium">
                                            <Clock className="h-3 w-3" />
                                            {item.date}
                                        </div>
                                        <p className="text-xs text-surface-500">{item.status}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Logs Table */}
                    <div className="bg-white p-8 rounded-2xl border border-surface-200 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2 font-serif">
                            <List className="h-5 w-5 text-primary-500" />
                            Logs
                        </h2>
                        <div className="overflow-hidden border border-surface-100 rounded-xl">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-surface-50 border-b border-surface-100 text-surface-400 font-bold">
                                        <th className="px-6 py-4">TIMESTAMP</th>
                                        <th className="px-6 py-4">EVENT TYPE</th>
                                        <th className="px-6 py-4">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-50">
                                    {[
                                        { time: "06-Nov 14:02", type: "API Call", status: "POST /api/v1/invoice/sign - 201 Created" },
                                        { time: "2025-11-08 09:35:22", type: "API Call", status: "POST /api/v1/invoice/validate - Validation successful" },
                                        { time: "2025-11-08 10:15:30", type: "Webhook", status: "Webhook received: Invoice cleared by NRS" },
                                        { time: "2025-11-08 09:30:00", type: "API Call", status: "Invoice data received from System Integrator" },
                                    ].map((log, i) => (
                                        <tr key={i} className="hover:bg-surface-50/50 transition-colors">
                                            <td className="px-6 py-4 text-surface-600 font-medium">{log.time}</td>
                                            <td className="px-6 py-4 text-surface-400">{log.type}</td>
                                            <td className="px-6 py-4 text-surface-600 font-medium">{log.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
                            <Button className="w-full gap-2 font-bold py-6">
                                <Send className="h-4 w-4" />
                                Transmit to Buyer
                            </Button>
                            <Button variant="outline" className="w-full gap-2 font-bold py-6 text-primary-500">
                                <FileJson className="h-4 w-4" />
                                View Raw JSON
                            </Button>
                            <Button variant="outline" className="w-full gap-2 font-bold py-6 text-primary-500">
                                <Download className="h-4 w-4" />
                                Download UBL
                            </Button>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-surface-100">
                            {[
                                { label: "IRN", value: "INV-2025-789012-5678" },
                                { label: "NRS Reference", value: "NRS-20251108-ABC123" },
                                { label: "Encryption", value: "AES-256-CFB" },
                                { label: "Digital Signature", value: "ECDSA-SHA256" },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-medium">
                                    <span className="text-surface-400">{item.label}</span>
                                    <span className="text-surface-900">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Line Items */}
                    <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm space-y-6">
                        <h2 className="text-base font-bold text-surface-900 flex items-center gap-2 font-serif">
                            <List className="h-5 w-5 text-primary-500" />
                            Line Items
                        </h2>
                        <div className="space-y-6 pb-6 border-b border-surface-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-surface-900 text-sm">Industrial Machinery Parts</p>
                                    <p className="text-[10px] text-surface-400 font-medium">Quantity: 50 units</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-surface-900 text-sm">₦1,000,000</p>
                                    <p className="text-[10px] text-surface-400 font-medium">₦20,000/unit</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-surface-900 text-sm">Shipping & Handling</p>
                                    <p className="text-[10px] text-surface-400 font-medium">Express Delivery</p>
                                </div>
                                <div className="text-right text-sm">
                                    <p className="font-bold text-surface-900">₦250,000</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center text-surface-600 font-medium">
                                <span>Total (excl. tax)</span>
                                <span>₦1,250,000</span>
                            </div>
                            <div className="flex justify-between items-center text-surface-600 font-medium">
                                <span className="flex items-center gap-2">VAT (10%)</span>
                                <span>₦125,000</span>
                            </div>
                            <div className="flex justify-between items-center font-bold text-lg text-primary-500 pt-2 border-t border-dashed border-surface-200">
                                <span>Amount Payable</span>
                                <span>₦1,375,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

