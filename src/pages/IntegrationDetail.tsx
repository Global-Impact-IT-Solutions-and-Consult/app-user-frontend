import * as React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { useToast } from "../components/ui/Toast";
import { useCompanyStore } from "../store/companyStore";
import { useZohoBooksStore, type ZohoJobStatus } from "../store/zohoBooksStore";
import { useQuickBooksStore, type QuickBooksJobStatus } from "../store/quickBooksStore";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { INTEGRATION_SERVICES } from "../lib/integrations";

const JOB_STATUS_BADGE: Record<ZohoJobStatus | QuickBooksJobStatus, { label: string; variant: "gray" | "success" | "warning" | "danger" | "primary" }> = {
    imported: { label: "Imported", variant: "gray" },
    submitted: { label: "Submitted", variant: "primary" },
    processing: { label: "Processing", variant: "warning" },
    processed: { label: "Processed", variant: "primary" },
    writeback_pending: { label: "Writeback Pending", variant: "warning" },
    completed: { label: "Completed", variant: "success" },
    failed: { label: "Failed", variant: "danger" },
};

function formatDate(value: string | null) {
    if (!value) return "—";
    return new Date(value).toLocaleString();
}

export default function IntegrationDetail() {
    const { service } = useParams<{ service: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    const integration = INTEGRATION_SERVICES.find((s) => s.slug === service);
    const Icon = integration?.icon;
    const isZohoBooks = service === "zoho-books";
    const isQuickBooks = service === "quickbooks";

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

                <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                    <header className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                            {Icon && <Icon className="h-6 w-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-surface-900 font-serif">
                                {integration?.name ?? "Unknown Service"}
                            </h2>
                            <p className="text-surface-900/70 text-sm">
                                {integration?.description ?? "This integration could not be found."}
                            </p>
                        </div>
                    </header>

                    {isZohoBooks ? (
                        <ZohoBooksPanel
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            toast={toast}
                        />
                    ) : isQuickBooks ? (
                        <QuickBooksPanel
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            toast={toast}
                        />
                    ) : integration ? (
                        <div className="rounded-xl border border-dashed border-surface-200 p-8 text-center space-y-2">
                            <Badge variant="gray">Coming Soon</Badge>
                            <p className="text-sm text-surface-900/70">
                                {integration.name} isn't connected to the backend yet. Check back soon.
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function ZohoBooksPanel({
    searchParams,
    setSearchParams,
    toast,
}: {
    searchParams: URLSearchParams;
    setSearchParams: (params: URLSearchParams, opts?: { replace?: boolean }) => void;
    toast: ReturnType<typeof useToast>["toast"];
}) {
    const { currentCompany } = useCompanyStore();
    const {
        connected,
        configured,
        organizationId,
        lastSyncedAt,
        environment,
        connectedAt,
        message,
        isLoading,
        isSyncing,
        error,
        jobs,
        fetchStatus,
        connect,
        disconnect,
        sync,
        fetchJobs,
    } = useZohoBooksStore();

    const [showDisconnectConfirm, setShowDisconnectConfirm] = React.useState(false);
    const companyId = currentCompany?.id;

    React.useEffect(() => {
        if (!companyId) return;
        fetchStatus(companyId);
        fetchJobs(companyId, 1, 5);
    }, [companyId, fetchStatus, fetchJobs]);

    // Landed back here after the Zoho OAuth redirect (?zoho=connected|error&companyId=...)
    // Ref-guarded so React 18 StrictMode's double effect invocation in dev
    // (and any other re-run before the URL params actually clear) doesn't double-toast.
    const handledZohoParamRef = React.useRef<string | null>(null);
    React.useEffect(() => {
        const zohoParam = searchParams.get("zoho");
        if (!zohoParam || handledZohoParamRef.current === zohoParam) return;
        handledZohoParamRef.current = zohoParam;

        if (zohoParam === "connected") {
            toast({
                title: "Zoho Books connected",
                description: "Your Zoho Books account is now linked.",
                variant: "success",
            });
            setSearchParams(new URLSearchParams(), { replace: true });
            if (companyId) fetchStatus(companyId);
        } else if (zohoParam === "error") {
            toast({
                title: "Couldn't connect Zoho Books",
                description: searchParams.get("message") || "Something went wrong finishing the Zoho Books connection.",
                variant: "error",
                duration: 8000,
            });
            setSearchParams(new URLSearchParams(), { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    if (!companyId) {
        return (
            <p className="text-sm text-surface-900/70">
                No company selected yet. Complete onboarding to connect Zoho Books.
            </p>
        );
    }

    const handleConnect = async () => {
        try {
            await connect(companyId);
        } catch {
            toast({
                title: "Couldn't start connection",
                description: error || "Failed to start the Zoho Books connection.",
                variant: "error",
            });
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect(companyId);
            toast({ title: "Zoho Books disconnected", variant: "default" });
        } catch {
            toast({
                title: "Couldn't disconnect",
                description: error || "Failed to disconnect Zoho Books.",
                variant: "error",
            });
        }
    };

    const handleSync = async () => {
        try {
            await sync(companyId);
            toast({ title: "Sync started", description: "Pulling recent invoices from Zoho Books.", variant: "success" });
            fetchJobs(companyId, 1, 5);
        } catch {
            toast({
                title: "Sync failed",
                description: error || "Failed to sync Zoho Books invoices.",
                variant: "error",
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100">
                <div className="flex items-center gap-3">
                    <Badge variant={connected ? "success" : "gray"}>
                        {connected ? "Connected" : "Not Connected"}
                    </Badge>
                    {!connected && !configured && (
                        <span className="text-xs text-surface-900/70 font-medium">
                            {message || "Zoho Books isn't configured on the backend yet."}
                        </span>
                    )}
                </div>
                {connected ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 font-bold"
                            onClick={handleSync}
                            isLoading={isSyncing}
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Sync Now
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            className="font-bold"
                            onClick={() => setShowDisconnectConfirm(true)}
                        >
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        className="font-bold"
                        onClick={handleConnect}
                        isLoading={isLoading}
                        disabled={!configured && !connected}
                    >
                        Connect
                    </Button>
                )}
            </div>

            {connected && (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Organization ID</dt>
                        <dd className="font-bold text-surface-900">{organizationId || "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Environment</dt>
                        <dd className="font-bold text-surface-900 capitalize">{environment || "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Connected Since</dt>
                        <dd className="font-bold text-surface-900">{formatDate(connectedAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Last Synced</dt>
                        <dd className="font-bold text-surface-900">{formatDate(lastSyncedAt)}</dd>
                    </div>
                </dl>
            )}

            {connected && (
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-surface-900">Recent Invoice Jobs</h3>
                    {jobs.length === 0 ? (
                        <p className="text-xs text-surface-900/70">No invoice jobs yet. Run a sync to pull recent invoices.</p>
                    ) : (
                        <div className="space-y-2">
                            {jobs.map((job) => {
                                const statusInfo = JOB_STATUS_BADGE[job.status] || { label: job.status, variant: "gray" as const };
                                return (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-surface-100 text-sm"
                                    >
                                        <span className="font-medium text-surface-900">
                                            {job.zohoInvoiceNumber || job.zohoInvoiceId}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-surface-900/50">{formatDate(job.updatedAt)}</span>
                                            <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            <ConfirmModal
                isOpen={showDisconnectConfirm}
                onClose={() => setShowDisconnectConfirm(false)}
                onConfirm={handleDisconnect}
                title="Disconnect Zoho Books?"
                description="This will stop syncing invoices from Zoho Books for this company. You can reconnect at any time."
                confirmText="Disconnect"
                variant="danger"
            />
        </div>
    );
}

function QuickBooksPanel({
    searchParams,
    setSearchParams,
    toast,
}: {
    searchParams: URLSearchParams;
    setSearchParams: (params: URLSearchParams, opts?: { replace?: boolean }) => void;
    toast: ReturnType<typeof useToast>["toast"];
}) {
    const { currentCompany } = useCompanyStore();
    const {
        connected,
        configured,
        realmId,
        apiBaseUrl,
        lastSyncedAt,
        environment,
        expiresAt,
        connectedAt,
        message,
        isLoading,
        isSyncing,
        error,
        jobs,
        fetchStatus,
        connect,
        disconnect,
        sync,
        fetchJobs,
    } = useQuickBooksStore();

    const [showDisconnectConfirm, setShowDisconnectConfirm] = React.useState(false);
    const [now, setNow] = React.useState<number | null>(null);
    const companyId = currentCompany?.id;
    const needsReconnect = Boolean(
        now && connected && expiresAt && new Date(expiresAt).getTime() <= now
    );

    React.useEffect(() => {
        setNow(Date.now());
    }, []);

    React.useEffect(() => {
        if (!companyId) return;
        fetchStatus(companyId);
        fetchJobs(companyId, 1, 5);
    }, [companyId, fetchJobs, fetchStatus]);

    const handledQuickBooksParamRef = React.useRef<string | null>(null);
    React.useEffect(() => {
        const quickBooksParam = searchParams.get("quickbooks");
        if (!quickBooksParam || handledQuickBooksParamRef.current === quickBooksParam) return;
        handledQuickBooksParamRef.current = quickBooksParam;

        if (quickBooksParam === "connected") {
            toast({
                title: "QuickBooks connected",
                description: "Your QuickBooks Online company is now linked.",
                variant: "success",
            });
            setSearchParams(new URLSearchParams(), { replace: true });
            if (companyId) fetchStatus(companyId);
        } else if (quickBooksParam === "error") {
            toast({
                title: "Couldn't connect QuickBooks",
                description: searchParams.get("message") || "Something went wrong finishing the QuickBooks connection.",
                variant: "error",
                duration: 8000,
            });
            setSearchParams(new URLSearchParams(), { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    if (!companyId) {
        return (
            <p className="text-sm text-surface-900/70">
                No company selected yet. Complete onboarding to connect QuickBooks.
            </p>
        );
    }

    const handleConnect = async () => {
        try {
            await connect(companyId);
        } catch {
            toast({
                title: "Couldn't start connection",
                description: error || "Failed to start the QuickBooks connection.",
                variant: "error",
            });
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect(companyId);
            toast({ title: "QuickBooks disconnected", variant: "default" });
        } catch {
            toast({
                title: "Couldn't disconnect",
                description: error || "Failed to disconnect QuickBooks.",
                variant: "error",
            });
        }
    };

    const handleSync = async () => {
        try {
            await sync(companyId);
            toast({ title: "Sync started", description: "Pulling recent invoices from QuickBooks.", variant: "success" });
            fetchJobs(companyId, 1, 5);
        } catch {
            toast({
                title: "Sync failed",
                description: error || "Failed to sync QuickBooks invoices.",
                variant: "error",
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100">
                <div className="flex items-center gap-3">
                    <Badge variant={needsReconnect ? "warning" : connected ? "success" : "gray"}>
                        {needsReconnect ? "Reconnect Required" : connected ? "Connected" : "Not Connected"}
                    </Badge>
                    {!connected && !configured && (
                        <span className="text-xs text-surface-900/70 font-medium">
                            {message || "QuickBooks isn't configured on the backend yet."}
                        </span>
                    )}
                    {connected && apiBaseUrl && (
                        <span className="text-xs text-surface-900/60 font-medium">
                            {apiBaseUrl.includes("sandbox") ? "Sandbox" : "Production"}
                        </span>
                    )}
                </div>
                {connected && !needsReconnect ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 font-bold"
                            onClick={handleSync}
                            isLoading={isSyncing}
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Sync Now
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            className="font-bold"
                            onClick={() => setShowDisconnectConfirm(true)}
                        >
                            Disconnect
                        </Button>
                    </div>
                ) : connected && needsReconnect ? (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            className="font-bold"
                            onClick={handleConnect}
                            isLoading={isLoading}
                        >
                            Reconnect
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            className="font-bold"
                            onClick={() => setShowDisconnectConfirm(true)}
                        >
                            Disconnect
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="primary"
                        size="sm"
                        className="font-bold"
                        onClick={handleConnect}
                        isLoading={isLoading}
                        disabled={!configured && !connected}
                    >
                        Connect
                    </Button>
                )}
            </div>

            {connected && (
                <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Realm ID</dt>
                        <dd className="font-bold text-surface-900">{realmId || "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Environment</dt>
                        <dd className="font-bold text-surface-900 capitalize">{environment || "—"}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Connected Since</dt>
                        <dd className="font-bold text-surface-900">{formatDate(connectedAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Last Synced</dt>
                        <dd className="font-bold text-surface-900">{formatDate(lastSyncedAt)}</dd>
                    </div>
                    <div>
                        <dt className="text-surface-900/50 text-xs font-medium">Token Expires</dt>
                        <dd className="font-bold text-surface-900">{formatDate(expiresAt)}</dd>
                    </div>
                </dl>
            )}

            {connected && (
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-surface-900">Recent Invoice Jobs</h3>
                    {jobs.length === 0 ? (
                        <p className="text-xs text-surface-900/70">No invoice jobs yet. Run a sync to pull recent invoices.</p>
                    ) : (
                        <div className="space-y-2">
                            {jobs.map((job) => {
                                const statusInfo = JOB_STATUS_BADGE[job.status] || { label: job.status, variant: "gray" as const };
                                return (
                                    <div
                                        key={job.id}
                                        className="flex items-center justify-between p-3 rounded-lg border border-surface-100 text-sm"
                                    >
                                        <span className="font-medium text-surface-900">
                                            {job.quickbooksInvoiceNumber || job.quickbooksInvoiceId}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-surface-900/50">{formatDate(job.updatedAt)}</span>
                                            <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}

            <ConfirmModal
                isOpen={showDisconnectConfirm}
                onClose={() => setShowDisconnectConfirm(false)}
                onConfirm={handleDisconnect}
                title="Disconnect QuickBooks?"
                description="This will stop syncing invoices from QuickBooks for this company. You can reconnect at any time."
                confirmText="Disconnect"
                variant="danger"
            />
        </div>
    );
}
