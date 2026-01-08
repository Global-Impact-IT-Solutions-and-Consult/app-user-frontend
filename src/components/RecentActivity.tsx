import { Badge } from "./ui/Badge";
import { Send, Download } from "lucide-react";

const activities = [
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
        date: "2025-11-07",
        counterparty: "Tech Innovations (Buyer)",
        amount: "₦850,450",
        status: "Sent to NRS",
        statusVariant: "primary" as const,
        action: "Monitor"
    }
];

interface RecentActivityProps {
    period?: string;
}

export const RecentActivity = ({ period }: RecentActivityProps) => {
    // Simulate filtering based on period
    const filteredActivities = period === "7days"
        ? activities.slice(0, 3)
        : activities;

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
                        {filteredActivities.map((activity, index) => (
                            <tr key={index} className="hover:bg-surface-50/50 transition-colors">
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
                                <td className="px-6 py-4 text-surface-900">{activity.date}</td>
                                <td className="px-6 py-4 text-surface-600">{activity.counterparty}</td>
                                <td className="px-6 py-4 text-surface-900">{activity.amount}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={activity.statusVariant} size="sm">
                                        {activity.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-primary-500 font-medium hover:underline">
                                        {activity.action}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};
