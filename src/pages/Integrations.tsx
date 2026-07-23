import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Plug, BookOpen, Layers, Boxes, Database } from "lucide-react";
import { useCompanyStore } from "../store/companyStore";
import { useZohoBooksStore, type ZohoWebhookStatus } from "../store/zohoBooksStore";

export interface IntegrationService {
    slug: string;
    name: string;
    description: string;
    icon: React.ElementType;
    comingSoon?: boolean;
}

export const INTEGRATION_SERVICES: IntegrationService[] = [
    {
        slug: "zoho-books",
        name: "Zoho Books",
        description: "Sync invoices and payments with Zoho Books",
        icon: BookOpen,
    },
    {
        slug: "sage",
        name: "Sage",
        description: "Connect your Sage accounting data",
        icon: Layers,
        comingSoon: true,
    },
    {
        slug: "sap",
        name: "SAP",
        description: "Integrate with SAP for enterprise resource planning",
        icon: Boxes,
        comingSoon: true,
    },
    {
        slug: "oracle-netsuite",
        name: "Oracle NetSuite",
        description: "Connect Oracle NetSuite for financial management",
        icon: Database,
        comingSoon: true,
    },
];

const STATUS_BADGE: Record<ZohoWebhookStatus, { label: string; variant: "gray" | "warning" | "success" }> = {
    none: { label: "Not Connected", variant: "gray" },
    pending: { label: "Pending", variant: "warning" },
    connected: { label: "Connected", variant: "success" },
};

export default function Integrations() {
    const navigate = useNavigate();
    const { currentCompany } = useCompanyStore();
    const { status: zohoStatus, fetchStatus } = useZohoBooksStore();

    React.useEffect(() => {
        if (currentCompany?.id) {
            fetchStatus(currentCompany.id);
        }
    }, [currentCompany?.id, fetchStatus]);

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
                            const badge = service.comingSoon
                                ? { label: "Coming Soon", variant: "gray" as const }
                                : STATUS_BADGE[zohoStatus] ?? STATUS_BADGE.none;
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
                                        Connect
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
