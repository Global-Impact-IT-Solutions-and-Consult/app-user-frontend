import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { useToast } from "../components/ui/Toast";
import { ArrowLeft, Copy, PlugZap } from "lucide-react";
import { INTEGRATION_SERVICES } from "./Integrations";
import { useCompanyStore } from "../store/companyStore";
import { useAuthStore } from "../store/authStore";
import { useZohoBooksStore } from "../store/zohoBooksStore";

const STATUS_BADGE = {
    none: { label: "Not Connected", variant: "gray" as const },
    pending: { label: "Pending", variant: "warning" as const },
    connected: { label: "Connected", variant: "success" as const },
};

function ZohoBooksDetail() {
    const { toast } = useToast();
    const { currentCompany } = useCompanyStore();
    const { user } = useAuthStore();
    const {
        status,
        webhookUrl,
        webhookSecret,
        lastEventAt,
        jobs,
        isLoading,
        fetchStatus,
        createWebhook,
        simulateWebhook,
        disconnectWebhook,
        fetchJobs,
    } = useZohoBooksStore();
    const [showDisconnect, setShowDisconnect] = React.useState(false);
    const [revealSecret, setRevealSecret] = React.useState(false);

    React.useEffect(() => {
        if (currentCompany?.id) {
            fetchStatus(currentCompany.id);
            fetchJobs(currentCompany.id);
        }
    }, [currentCompany?.id, fetchStatus, fetchJobs]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard", variant: "success", duration: 2000 });
    };

    const handleGenerate = async () => {
        if (!currentCompany?.id) return;
        try {
            await createWebhook(currentCompany.id, user?.currentEnvironment || "test");
            toast({ title: "Webhook URL generated", description: "Paste it into your Zoho Books account to finish connecting.", variant: "success" });
        } catch {
            toast({ title: "Failed to generate webhook", variant: "error" });
        }
    };

    const handleSimulate = async () => {
        if (!currentCompany?.id) return;
        try {
            await simulateWebhook(currentCompany.id);
            toast({ title: "Test event sent", description: "Connection confirmed.", variant: "success" });
        } catch {
            toast({ title: "Failed to simulate webhook", variant: "error" });
        }
    };

    const handleDisconnect = async () => {
        if (!currentCompany?.id) return;
        try {
            await disconnectWebhook(currentCompany.id);
            toast({ title: "Zoho Books disconnected", variant: "success" });
        } catch {
            toast({ title: "Failed to disconnect", variant: "error" });
        } finally {
            setShowDisconnect(false);
        }
    };

    const badge = STATUS_BADGE[status] ?? STATUS_BADGE.none;

    return (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
            <header className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                    <PlugZap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-surface-900 font-serif">Zoho Books</h2>
                        <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    </div>
                    <p className="text-surface-900/70 text-sm">
                        {lastEventAt ? `Last event: ${new Date(lastEventAt).toLocaleString()}` : "Sync invoices and payments with Zoho Books"}
                    </p>
                </div>
            </header>

            {status === "none" ? (
                <Button onClick={handleGenerate} isLoading={isLoading} className="gap-2 h-11 px-6 font-bold">
                    Generate Webhook URL
                </Button>
            ) : (
                <>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Webhook URL</label>
                            <div className="flex gap-2">
                                <Input value={webhookUrl || ""} readOnly className="flex-1 font-mono text-sm" />
                                <Button variant="outline" className="h-11 px-4" onClick={() => handleCopy(webhookUrl || "")} disabled={!webhookUrl}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[11px] text-primary-600 font-medium mt-1">
                                Paste this URL into your Zoho Books webhook settings
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Webhook Secret</label>
                            <div className="flex gap-2">
                                <Input
                                    value={webhookSecret || ""}
                                    readOnly
                                    type={revealSecret ? "text" : "password"}
                                    className="flex-1 font-mono text-sm"
                                />
                                <Button variant="outline" className="h-11 px-4" onClick={() => setRevealSecret((v) => !v)} disabled={!webhookSecret}>
                                    {revealSecret ? "Hide" : "Show"}
                                </Button>
                                <Button variant="outline" className="h-11 px-4" onClick={() => handleCopy(webhookSecret || "")} disabled={!webhookSecret}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button variant="outline" className="gap-2 h-10 px-6 font-bold border-surface-200 text-primary-600" onClick={handleSimulate} isLoading={isLoading}>
                            Simulate Test Connection
                        </Button>
                        <Button variant="outline" className="gap-2 h-10 px-6 font-bold border-danger-200 text-danger-500" onClick={() => setShowDisconnect(true)}>
                            Disconnect
                        </Button>
                    </div>

                    <section className="space-y-3">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Recent Invoices</h3>
                        {jobs.length === 0 ? (
                            <p className="text-sm text-surface-900/70">No invoices received yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {jobs.map((job) => (
                                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg border border-surface-100">
                                        <span className="text-sm font-medium text-surface-900">{job.id}</span>
                                        <Badge variant="gray" size="sm">{job.status}</Badge>
                                        <span className="text-xs text-surface-900/70">{new Date(job.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}

            <ConfirmModal
                isOpen={showDisconnect}
                onClose={() => setShowDisconnect(false)}
                onConfirm={handleDisconnect}
                title="Disconnect Zoho Books?"
                description="This will disable the webhook. Invoices from Zoho Books will no longer be received until you reconnect."
                confirmText="Disconnect"
                variant="danger"
            />
        </div>
    );
}

export default function IntegrationDetail() {
    const { service } = useParams<{ service: string }>();
    const navigate = useNavigate();

    const integration = INTEGRATION_SERVICES.find((s) => s.slug === service);

    return (
        <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <button
                    onClick={() => navigate("/dashboard/integrations")}
                    className="flex items-center gap-2 text-sm font-medium text-surface-900/70 hover:text-surface-900 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Integrations
                </button>

                {!integration ? (
                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8">
                        <p className="text-surface-900/70 text-sm">This integration could not be found.</p>
                    </div>
                ) : service === "zoho-books" ? (
                    <ZohoBooksDetail />
                ) : (
                    <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-2">
                        <h2 className="text-xl font-bold text-surface-900 font-serif">{integration.name}</h2>
                        <p className="text-surface-900/70 text-sm">This integration isn't available yet. Check back soon.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
