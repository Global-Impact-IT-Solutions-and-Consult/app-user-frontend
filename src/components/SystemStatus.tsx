export const SystemStatus = () => {
    const statuses = [
        {
            label: "NRS Connection",
            status: "Connected to Sandbox • 142ms",
            color: "bg-success-500"
        },
        {
            label: "Webhook Listener",
            status: "Active • Processing",
            color: "bg-success-500"
        },
        {
            label: "Database",
            status: "Healthy • 78% storage",
            color: "bg-warning-500"
        },
        {
            label: "Compliance",
            status: "Up to date",
            color: "bg-success-500"
        }
    ];

    return (
        <section className="space-y-4">
            <h2 className="text-lg font-bold text-surface-900">System Status</h2>
            <div className="flex flex-wrap items-center justify-between p-6 bg-white border border-surface-200 rounded-xl gap-6">
                {statuses.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                        <div>
                            <p className="text-sm font-bold text-surface-900 leading-tight">{item.label}</p>
                            <p className="text-[10px] text-surface-900/70 font-medium">{item.status}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
