import { Badge } from "./ui/Badge";
import { FileText } from "lucide-react";
import { useReceiptStore } from "../store/receiptStore";
import { formatCurrency } from "../lib/utils";



export const RecentActivity = () => {
    const { receipts, isLoading } = useReceiptStore();
    const displayReceipts = receipts.slice(0, 10);

    const getStatusVariant = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'cleared' || s === 'success' || s === 'paid') return 'success';
        if (s === 'processing' || s === 'pending') return 'warning';
        if (s === 'failed' || s === 'rejected') return 'danger';
        return 'primary';
    };

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-bold text-surface-900">Recent Activity</h2>
            <div className="overflow-x-auto rounded-xl border border-surface-200 bg-white">
                <table className="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr className="bg-surface-50 border-b border-surface-200">
                            <th className="px-6 py-4 font-bold text-surface-400">TYPE</th>
                            <th className="px-6 py-4 font-bold text-surface-400">INVOICE ID</th>
                            <th className="px-6 py-4 font-bold text-surface-400">DATE</th>
                            <th className="px-6 py-4 font-bold text-surface-400">COUNTERPARTY</th>
                            <th className="px-6 py-4 font-bold text-surface-400">AMOUNT</th>
                            <th className="px-6 py-4 font-bold text-surface-400">STATUS</th>
                            <th className="px-6 py-4 font-bold text-surface-400">ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {isLoading && displayReceipts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-surface-500">Loading recent activity...</td>
                            </tr>
                        ) : displayReceipts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-surface-500">No recent activity found.</td>
                            </tr>
                        ) : (
                            displayReceipts.map((receipt, index) => (
                                <tr key={receipt.id || index} className="hover:bg-surface-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Badge
                                                variant="primary"
                                                size="sm"
                                                className="font-medium"
                                                icon={<FileText className="h-3 w-3" />}
                                            >
                                                {receipt.type || 'Invoice'}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-surface-600 font-medium">{receipt.receiptNumber}</td>
                                    <td className="px-6 py-4 text-surface-900">{new Date(receipt.issueDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-surface-600">{receipt.counterpartyName}</td>
                                    <td className="px-6 py-4 text-surface-900 font-bold">
                                        {formatCurrency(receipt.totalAmount, receipt.currency)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={getStatusVariant(receipt.status)} size="sm">
                                            {receipt.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-primary-500 font-medium hover:underline">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
