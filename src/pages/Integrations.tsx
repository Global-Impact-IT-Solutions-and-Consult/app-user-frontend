import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Plug } from "lucide-react";
import { useCompanyStore } from "../store/companyStore";
import { useZohoBooksStore } from "../store/zohoBooksStore";
import { useQuickBooksStore } from "../store/quickBooksStore";
import { useXeroStore } from "../store/xeroStore";
import { INTEGRATION_SERVICES } from "../lib/integrations";

export default function Integrations() {
    const navigate = useNavigate();
    const { currentCompany } = useCompanyStore();
    const { connected: zohoConnected, fetchStatus } = useZohoBooksStore();
    const {
        connected: quickBooksConnected,
        expiresAt: quickBooksExpiresAt,
        fetchStatus: fetchQuickBooksStatus
    } = useQuickBooksStore();
    const {
        connected: xeroConnected,
        expiresAt: xeroExpiresAt,
        fetchStatus: fetchXeroStatus
    } = useXeroStore();
    const [now, setNow] = React.useState<number | null>(null);
    const quickBooksNeedsReconnect =
        Boolean(now && quickBooksConnected && quickBooksExpiresAt && new Date(quickBooksExpiresAt).getTime() <= now);
    const xeroNeedsReconnect =
        Boolean(now && xeroConnected && xeroExpiresAt && new Date(xeroExpiresAt).getTime() <= now);

    React.useEffect(() => {
        setNow(Date.now());
    }, []);

    React.useEffect(() => {
        if (currentCompany?.id) {
            fetchStatus(currentCompany.id);
            fetchQuickBooksStatus(currentCompany.id);
            fetchXeroStatus(currentCompany.id);
        }
    }, [currentCompany?.id, fetchQuickBooksStatus, fetchStatus, fetchXeroStatus]);

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="space-y-1">
                    <h1 className="text-3xl font-bold text-surface-900 font-serif">Integrations</h1>
                    <p className="text-surface-900/70 text-sm">
                        Connect your accounting and ERP tools to sync data automatically
                    </p>
                </header>

                <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                    <header className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                            <Plug className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 font-serif">Available Integrations</h2>
                            <p className="text-surface-900/70 text-sm">Connect a service to get started</p>
                        </div>
                    </header>

                    <section className="space-y-4">
                        {INTEGRATION_SERVICES.map((service) => {
                            const Icon = service.icon;
                            const isConnected =
                                service.slug === "zoho-books"
                                    ? zohoConnected
                                    : service.slug === "quickbooks"
                                        ? quickBooksConnected
                                        : service.slug === "xero"
                                            ? xeroConnected
                                        : false;
                            const needsReconnect =
                                service.slug === "quickbooks"
                                    ? quickBooksNeedsReconnect
                                    : service.slug === "xero"
                                        ? xeroNeedsReconnect
                                        : false;
                            const badge = service.comingSoon
                                ? { label: "Coming Soon", variant: "gray" as const }
                                : needsReconnect
                                    ? { label: "Reconnect Required", variant: "warning" as const }
                                    : isConnected
                                        ? { label: "Connected", variant: "success" as const }
                                        : { label: "Not Connected", variant: "gray" as const };
                            const actionLabel = service.comingSoon
                                ? "Connect"
                                : needsReconnect
                                    ? "Reconnect"
                                    : isConnected
                                        ? "Manage"
                                        : "Connect";
                            return (
                                <div
                                    key={service.slug}
                                    className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:border-primary-100 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white shadow-sm ring-4 ring-primary-50">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-surface-900">{service.name}</p>
                                                <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                                            </div>
                                            <p className="text-xs text-surface-900/70 font-medium">{service.description}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="h-9 px-4 gap-2 text-xs font-bold border-surface-200"
                                        disabled={service.comingSoon}
                                        onClick={() => navigate(`/dashboard/integrations/${service.slug}`)}
                                    >
                                        {actionLabel}
                                    </Button>
                                </div>
                            );
                        })}
                    </section>
                </div>
            </div>
        </div>
    );
}
