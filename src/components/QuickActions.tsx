import {
    FileCheck,
    Send,
    Search,
    ListTodo
} from "lucide-react";

interface QuickActionProps {
    icon: React.ElementType;
    title: string;
    description: string;
    onClick?: () => void;
}

const QuickActionCard = ({ icon: Icon, title, description, onClick }: QuickActionProps) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-6 bg-white border border-surface-200 rounded-xl hover:shadow-md transition-all group"
    >
        <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
            <Icon className="h-6 w-6 text-primary-500 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-sm font-bold text-surface-900 mb-1">{title}</h3>
        <p className="text-xs text-surface-900/70 text-center">{description}</p>
    </button>
);

export const QuickActions = () => {
    const actions = [
        {
            icon: FileCheck,
            title: "Validate Invoice",
            description: "Checking against NRS schema"
        },
        {
            icon: Send,
            title: "Transmit",
            description: "Send to buyer"
        },
        {
            icon: Search,
            title: "Check Status",
            description: "Query Invoice Status"
        },
        {
            icon: ListTodo,
            title: "View Logs",
            description: "System activity"
        }
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-bold text-surface-900">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {actions.map((action, index) => (
                    <QuickActionCard key={index} {...action} />
                ))}
            </div>
        </section>
    );
};
