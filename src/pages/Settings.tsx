import * as React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Toggle } from "../components/ui/Toggle";
import {
    Building2,
    Shield,
    Users,
    RotateCcw,
    Copy,
    Zap,
    UserPlus,
    Edit3,
    Trash2,
    AlertTriangle,
    Info,
    Clock,
    X,
    Key,
    Ban
} from "lucide-react";
import { cn } from "../lib/utils";
import { useCompanyStore } from "../store/companyStore";
import { useLogStore } from "../store/logStore";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/ui/Toast";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { MfaSetupModal } from "../components/MfaSetupModal";
import { DisableMfaModal } from "../components/DisableMfaModal";
import { isApiSetupComplete } from "../lib/onboarding";

const tabs = [
    { label: "General", id: "general" },
    { label: "API & Webhooks", id: "api" },
    { label: "Security", id: "security" },
    { label: "User Management", id: "user-management" },
    { label: "Danger Zone", id: "danger-zone" },
];

export default function Settings() {
    const location = useLocation();
    const initialTab = (location.state as { tab?: string } | null)?.tab;
    const [activeTab, setActiveTab] = React.useState(initialTab || "general");

    const renderTabContent = () => {
        switch (activeTab) {
            case "general":
                return <GeneralTab />;
            case "api":
                return <ApiTab />;
            case "security":
                return <SecurityTab />;
            case "user-management":
                return <UserManagementTab />;
            case "danger-zone":
                return <DangerZoneTab />;
            default:
                return <GeneralTab />;
        }
    };

    return (
        <div className="p-8 space-y-6">
            <header className="space-y-1">
                <h1 className="text-3xl font-bold text-surface-900 font-serif">Settings</h1>
                <p className="text-surface-900/70 text-sm">
                    Configure your account, API, and system preferences
                </p>
            </header>

            {/* Tabs */}
            <div className="flex bg-white rounded-xl border border-surface-200 p-1 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                            activeTab === tab.id
                                ? "bg-primary-500 text-white shadow-sm"
                                : "text-surface-900/60 hover:text-surface-900"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[600px]">
                {renderTabContent()}
            </div>
        </div>
    );
}

// --- Tab Components ---

const GeneralTab = () => {
    const { currentCompany, updateCompany, isLoading } = useCompanyStore();
    const { toast } = useToast();

    const [form, setForm] = React.useState({
        legalName: "",
        name: "",
        taxId: "",
        registeredAddress: "",
        contactEmail: "",
        contactPhone: "",
    });

    React.useEffect(() => {
        if (!currentCompany) return;
        setForm({
            legalName: currentCompany.legalName || "",
            name: currentCompany.name || "",
            taxId: currentCompany.taxId || "",
            registeredAddress: currentCompany.registeredAddress || "",
            contactEmail: currentCompany.contactEmail || "",
            contactPhone: currentCompany.contactPhone || "",
        });
    }, [currentCompany]);

    const updateField = (field: keyof typeof form, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!currentCompany?.id) return;
        try {
            await updateCompany(currentCompany.id, form);
            toast({ title: "Company profile updated", variant: "success" });
        } catch {
            toast({ title: "Couldn't save changes", description: "Failed to update company profile.", variant: "error" });
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                    <Building2 className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-surface-900 font-serif">Company Information</h2>
                    <p className="text-surface-900/70 text-sm">Your registered business details</p>
                </div>
            </header>

            <div className="space-y-6">
                <section className="space-y-4">
                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Legal Details</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Legal Business Name <span className="text-danger-500">*</span></label>
                            <Input value={form.legalName} onChange={(e) => updateField("legalName", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Trading Name <span className="text-danger-500">*</span></label>
                            <Input value={form.name} onChange={(e) => updateField("name", e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">RC Number <span className="text-danger-500">*</span></label>
                            <Input value={form.taxId} onChange={(e) => updateField("taxId", e.target.value)} />
                        </div>
                    </div>
                </section>

                <section className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Contact Information</h3>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Registered Address</label>
                            <textarea
                                className="w-full min-h-[100px] p-4 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-900 placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                                placeholder="Full street address, city, state"
                                value={form.registeredAddress}
                                onChange={(e) => updateField("registeredAddress", e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-surface-900">Contact Email</label>
                                <Input value={form.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-surface-900">Contact Phone</label>
                                <Input value={form.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-end pt-4 border-t border-surface-100">
                    <Button className="font-bold h-11 px-8" onClick={handleSave} disabled={isLoading || !currentCompany?.id}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ApiTab = () => {
    const {
        currentCompany,
        companySettings,
        fetchCompanySettings,
        fetchWebhooks,
        webhooks,
        createWebhook,
        updateWebhook,
        testWebhook,
        regenerateApiKey,
        revokeApiKey,
        updateOnboardingStep,
        deleteWebhook,
        regenerateWebhookSecret
    } = useCompanyStore();

    const [webhookUrl, setWebhookUrl] = React.useState("");
    const [webhookActive, setWebhookActive] = React.useState(true);
    const [webhookSecret, setWebhookSecret] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [isTesting, setIsTesting] = React.useState(false);
    const [isDeletingWebhook, setIsDeletingWebhook] = React.useState(false);
    const [deleteWebhookOpen, setDeleteWebhookOpen] = React.useState(false);
    const [isRegeneratingSecret, setIsRegeneratingSecret] = React.useState(false);
    const [regenerateSecretOpen, setRegenerateSecretOpen] = React.useState(false);
    const { toast } = useToast();
    const { user, setEnvironment } = useAuthStore();
    const selectedEnv = user?.currentEnvironment || 'test';

    // Load existing webhook data if available
    React.useEffect(() => {
        if (webhooks.length > 0) {
            const hook = webhooks[0];
            setWebhookUrl(hook.url);
            setWebhookActive(hook.isActive);
            if (hook.signingSecret) setWebhookSecret(hook.signingSecret);
        }
    }, [webhooks]);

    React.useEffect(() => {
        if (currentCompany?.id) {
            fetchCompanySettings(currentCompany.id);
            fetchWebhooks(currentCompany.id);
        }
    }, [currentCompany?.id, fetchCompanySettings, fetchWebhooks]);

    const activeSetting = companySettings?.settings.find(s => s.type === selectedEnv);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard", variant: "default", duration: 2000 });
    };

    const [regenerateKeyId, setRegenerateKeyId] = React.useState<string | null>(null);
    const [revokeKeyId, setRevokeKeyId] = React.useState<string | null>(null);

    // API setup only counts as done once both a key and a webhook exist -
    // called after either succeeds here, using the latest known state of both.
    const maybeMarkApiSetupComplete = async () => {
        if (!currentCompany?.id) return;
        const state = useCompanyStore.getState();
        const hasApiKey = !!state.companySettings?.settings?.find(s => s.type === 'test')?.publicKey;
        const hasWebhook = state.webhooks.length > 0;
        if (isApiSetupComplete(hasApiKey, hasWebhook)) {
            try {
                await updateOnboardingStep(currentCompany.id, "api_setup", true);
            } catch (err) {
                console.error("Failed to mark api_setup complete:", err);
                // Non-blocking - only feeds the Dashboard's finish-setup banner.
            }
        }
    };

    const handleConfirmRegenerate = async () => {
        if (regenerateKeyId && currentCompany?.id && user?.id) {
            const setting = companySettings?.settings.find(s => s.id === regenerateKeyId);
            if (setting && (setting.type === 'live' || setting.type === 'test')) {
                try {
                    await regenerateApiKey(currentCompany.id, setting.type);
                    toast({ title: "Key Regenerated", description: "API Key has been regenerated successfully.", variant: "success" });
                    await fetchCompanySettings(currentCompany.id);
                    await maybeMarkApiSetupComplete();
                } catch {
                    toast({ title: "Regeneration Failed", variant: "error" });
                }
            }
        }
        setRegenerateKeyId(null);
    };

    const handleConfirmRevoke = async () => {
        if (revokeKeyId && currentCompany?.id) {
            try {
                await revokeApiKey(currentCompany.id, revokeKeyId);
                toast({ title: "Key Revoked", description: "This API key no longer works. Regenerate a new one when you're ready.", variant: "success" });
                await fetchCompanySettings(currentCompany.id);
            } catch {
                toast({ title: "Couldn't revoke key", variant: "error" });
            }
        }
        setRevokeKeyId(null);
    };

    // Webhook Handlers
    const handleSaveWebhook = async () => {
        if (!currentCompany?.id) return;
        setIsSaving(true);
        try {
            if (webhooks.length > 0) {
                // Update
                const hook = webhooks[0];
                await updateWebhook(currentCompany.id, hook.id, {
                    url: webhookUrl,
                    isActive: webhookActive,
                });
                toast({ title: "Webhook updated", description: "Your webhook configuration has been saved.", variant: "success" });
            } else {
                // Create
                const newHook = await createWebhook(currentCompany.id, {
                    url: webhookUrl,
                    events: ['invoice.created', 'invoice.updated'],
                    environment: companySettings?.settings.find(s => s.type === 'live')?.isActive ? 'live' : 'test'
                });
                if (newHook && newHook.signingSecret) {
                    setWebhookSecret(newHook.signingSecret);
                }
                toast({ title: "Webhook created", description: "New webhook endpoint has been registered.", variant: "success" });
            }
            await maybeMarkApiSetupComplete();
        } catch {
            toast({ title: "Operation failed", description: "Failed to save webhook configuration.", variant: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleConfirmDeleteWebhook = async () => {
        if (!currentCompany?.id || webhooks.length === 0) {
            setDeleteWebhookOpen(false);
            return;
        }
        setIsDeletingWebhook(true);
        try {
            await deleteWebhook(currentCompany.id, webhooks[0].id);
            setWebhookUrl("");
            setWebhookSecret("");
            toast({ title: "Webhook deleted", description: "You'll stop receiving events at this URL.", variant: "success" });
        } catch {
            toast({ title: "Couldn't delete webhook", variant: "error" });
        } finally {
            setIsDeletingWebhook(false);
            setDeleteWebhookOpen(false);
        }
    };

    const handleConfirmRegenerateSecret = async () => {
        if (!currentCompany?.id || webhooks.length === 0) {
            setRegenerateSecretOpen(false);
            return;
        }
        setIsRegeneratingSecret(true);
        try {
            const secret = await regenerateWebhookSecret(currentCompany.id, webhooks[0].id);
            setWebhookSecret(secret);
            toast({ title: "Secret regenerated", description: "The old secret stopped working immediately.", variant: "success" });
        } catch {
            toast({ title: "Couldn't regenerate secret", variant: "error" });
        } finally {
            setIsRegeneratingSecret(false);
            setRegenerateSecretOpen(false);
        }
    };

    const handleTestWebhook = async () => {
        if (!currentCompany?.id || webhooks.length === 0) {
            toast({ title: "No webhook to test", description: "Save a webhook URL first, then send a test event.", variant: "warning" });
            return;
        }

        const hook = webhooks[0];
        const eventType = hook.subscribedEvents?.[0] || "invoice.created";
        setIsTesting(true);
        try {
            const result = await testWebhook(currentCompany.id, hook.id, eventType);
            if (result.success) {
                toast({
                    title: "Test sent",
                    description: `Your endpoint responded with status ${result.statusCode}.`,
                    variant: "success",
                });
            } else {
                toast({
                    title: "Endpoint didn't respond correctly",
                    description: result.error || "The test event was sent but delivery failed.",
                    variant: "error",
                });
            }
        } catch (err) {
            const message = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
            toast({
                title: "Couldn't send test webhook",
                description: message || "Failed to trigger the webhook test.",
                variant: "error",
            });
        } finally {
            setIsTesting(false);
        }
    };

    if (!currentCompany) return <div className="p-8 text-center">Please select a company first.</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* New API Configuration Card */}
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                <header className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                        <Key className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-900 font-serif">API Configuration</h2>
                        <p className="text-surface-900/70 text-sm">Manage your API keys and NRS connections</p>
                    </div>
                </header>

                <div className="space-y-8">
                    {/* Environment */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Environment</h3>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-surface-50/50">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-surface-900">Current Environment: {selectedEnv === 'live' ? 'Live' : 'Test'}</p>
                                <p className="text-xs text-surface-900/70">Switch between test and live environments</p>
                            </div>
                            <Toggle
                                checked={selectedEnv === 'live'}
                                onChange={async () => {
                                    const newEnv = selectedEnv === 'live' ? 'test' : 'live';
                                    try {
                                        await setEnvironment(newEnv);
                                        toast({ title: "Environment Switched", description: `Switched to ${newEnv} environment`, variant: "success" });
                                        // Refresh settings
                                        if (currentCompany?.id) {
                                            fetchCompanySettings(currentCompany.id);
                                            fetchWebhooks(currentCompany.id);
                                        }
                                    } catch {
                                        toast({ title: "Switch Failed", variant: "error" });
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium">
                            <Info className="h-4 w-4 shrink-0" />
                            Test environment connects to NRS Sandbox. Live environment requires production credentials.
                        </div>
                    </section>

                    {/* API Keys */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">API Keys</h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-surface-900">Primary API Key</label>
                                <div className="w-full px-4 py-3 bg-slate-900 text-slate-300 font-mono text-sm rounded-lg border border-slate-800 break-all min-h-[46px] flex items-center">
                                    {activeSetting?.isActive && activeSetting?.publicKey
                                        ? activeSetting.publicKey
                                        : <span className="text-slate-500 italic">No active key — generate one to get started</span>}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="gap-2 h-10 px-6 font-bold border-surface-200 text-primary-600"
                                    onClick={() => activeSetting?.id && setRegenerateKeyId(activeSetting.id)}
                                    disabled={!activeSetting?.id}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Regenerate
                                </Button>
                                <Button
                                    variant="outline"
                                    className="gap-2 h-10 px-6 font-bold border-surface-200 text-primary-600"
                                    onClick={() => handleCopy(activeSetting?.publicKey || '')}
                                    disabled={!activeSetting?.isActive || !activeSetting?.publicKey}
                                >
                                    <Copy className="h-4 w-4" />
                                    Copy
                                </Button>
                                <Button
                                    variant="danger"
                                    className="gap-2 h-10 px-6 font-bold bg-danger-50 text-danger-500 border-none hover:bg-danger-100"
                                    onClick={() => activeSetting?.id && setRevokeKeyId(activeSetting.id)}
                                    disabled={!activeSetting?.id || !activeSetting?.isActive}
                                >
                                    <Ban className="h-4 w-4" />
                                    Revoke
                                </Button>
                            </div>
                        </div>
                    </section>

                    {/* NRS Credentials */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">NRS Credentials</h3>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-surface-900">NRS Client ID</label>
                                <Input value={activeSetting?.nrsClientId || ''} readOnly />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-surface-900">NRS Client Secret</label>
                                <Input value={activeSetting?.nrsClientSecret || ''} type="password" readOnly />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium">
                                <Key className="h-3.5 w-3.5" />
                                Your secret is encrypted and never stored in plain text
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                <header className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-900 font-serif">Webhook Configuration</h2>
                        <p className="text-surface-900/70 text-sm">Configure how you receive notifications from NRS</p>
                    </div>
                </header>

                <section className="space-y-6">
                    <div className="space-y-6 border border-surface-200 rounded-xl p-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Webhook URL <span className="text-danger-500">*</span></label>
                            <Input
                                placeholder="https://api.yourdomain.com/webhooks"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                            />
                            <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium mt-1">
                                <Info className="h-3.5 w-3.5" />
                                This endpoint must be publicly accessible and highly available (99.9% uptime)
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-surface-50">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-surface-900">Webhook Retry</p>
                                <p className="text-xs text-surface-900/70">Automatically retry failed webhook deliveries</p>
                            </div>
                            <Toggle checked={webhookActive} onChange={() => setWebhookActive(!webhookActive)} />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Webhook Secret</label>
                            <div className="flex gap-2">
                                <Input
                                    value={webhookSecret || "*****************"}
                                    readOnly
                                    className="flex-1 font-mono text-sm"
                                    type={webhookSecret ? "text" : "password"}
                                />
                                {webhookSecret && (
                                    <Button variant="outline" className="h-10 px-4" onClick={() => handleCopy(webhookSecret)}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                )}
                                {webhooks.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="h-10 px-4 gap-2 text-primary-600 whitespace-nowrap"
                                        onClick={() => setRegenerateSecretOpen(true)}
                                        disabled={isRegeneratingSecret}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Regenerate
                                    </Button>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium mt-1">
                                <Shield className="h-3.5 w-3.5" />
                                Optional secret for verifying webhook signatures
                            </div>
                        </div>

                        <div className="bg-primary-50/30 rounded-xl border border-primary-100 p-6 space-y-4">
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-surface-900">Test Webhook</h4>
                                <p className="text-xs text-surface-900/70">Send a test webhook to verify your endpoint is working correctly</p>
                            </div>
                            <Button
                                variant="outline"
                                className="bg-white border-primary-200 text-primary-600 hover:bg-primary-50 gap-2 font-bold h-10"
                                onClick={handleTestWebhook}
                                disabled={isTesting}
                            >
                                <Zap className="h-4 w-4" />
                                {isTesting ? "Sending..." : "Send Test Webhook"}
                            </Button>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100">
                            {webhooks.length > 0 && (
                                <Button
                                    variant="danger"
                                    className="font-bold h-11 px-6 bg-danger-50 text-danger-500 border-none hover:bg-danger-100"
                                    onClick={() => setDeleteWebhookOpen(true)}
                                    disabled={isSaving || isDeletingWebhook}
                                >
                                    Delete Webhook
                                </Button>
                            )}
                            <Button className="font-bold h-11 px-8" onClick={handleSaveWebhook} disabled={isSaving}>
                                {isSaving ? "Saving..." : (webhooks.length > 0 ? "Update Webhook" : "Create Webhook")}
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
            <ConfirmModal
                isOpen={!!regenerateKeyId}
                onClose={() => setRegenerateKeyId(null)}
                onConfirm={handleConfirmRegenerate}
                title="Regenerate API Key"
                description="Are you sure? The old key will stop working immediately. Access relying on it will be interrupted."
                confirmText="Regenerate Key"
            />
            <ConfirmModal
                isOpen={!!revokeKeyId}
                onClose={() => setRevokeKeyId(null)}
                onConfirm={handleConfirmRevoke}
                title="Revoke API Key"
                description="This key will stop working immediately, with no replacement issued. Anything using it will break until you generate a new one."
                confirmText="Revoke Key"
                variant="danger"
            />
            <ConfirmModal
                isOpen={deleteWebhookOpen}
                onClose={() => setDeleteWebhookOpen(false)}
                onConfirm={handleConfirmDeleteWebhook}
                title="Delete Webhook"
                description="This removes the webhook entirely. You'll stop receiving events at this URL until you set up a new one."
                confirmText="Delete Webhook"
                variant="danger"
            />
            <ConfirmModal
                isOpen={regenerateSecretOpen}
                onClose={() => setRegenerateSecretOpen(false)}
                onConfirm={handleConfirmRegenerateSecret}
                title="Regenerate Webhook Secret"
                description="The old secret stops working immediately. Any integration verifying signatures with it will break until it's updated with the new one."
                confirmText="Regenerate Secret"
                variant="danger"
            />
        </div>
    );
};

const SecurityTab = () => {
    const { user } = useAuthStore();
    const { currentCompany, companySettings, fetchCompanySettings, updateMfaRequirement } = useCompanyStore();
    const [isMfaSetupOpen, setIsMfaSetupOpen] = React.useState(false);
    const [isDisableOpen, setIsDisableOpen] = React.useState(false);
    const [isUpdatingPolicy, setIsUpdatingPolicy] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        if (currentCompany?.id && !companySettings) {
            fetchCompanySettings(currentCompany.id);
        }
    }, [currentCompany?.id, companySettings, fetchCompanySettings]);

    const handleDisableMfa = async () => {
        setIsDisableOpen(true);
    };

    const handleEnforceMfaToggle = async (enforced: boolean) => {
        if (!currentCompany?.id) return;
        setIsUpdatingPolicy(true);
        try {
            await updateMfaRequirement(currentCompany.id, enforced);
            toast({
                title: enforced ? "MFA now required for all users" : "MFA requirement lifted",
                description: enforced
                    ? "Every user in this company must enable two-factor authentication."
                    : "Users can choose whether to enable two-factor authentication.",
                variant: "success",
            });
        } catch {
            toast({ title: "Couldn't update MFA policy", variant: "error" });
        } finally {
            setIsUpdatingPolicy(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                    <Shield className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-surface-900 font-serif">Security Settings</h2>
                    <p className="text-surface-900/70 text-sm">Manage authentication and security preferences</p>
                </div>
            </header>

            <section className="space-y-8">
                {/* Personal Security */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Your Security</h3>
                    <div className="flex items-center justify-between p-6 rounded-xl border border-surface-200 bg-surface-50">
                        <div className="flex items-center gap-4">
                            <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", user?.isMfaEnabled ? "bg-success-100 text-success-600" : "bg-surface-200 text-surface-500")}>
                                <Shield className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-surface-900">Two-Factor Authentication</p>
                                <p className="text-xs text-surface-600">
                                    {user?.isMfaEnabled
                                        ? "Your account is secured with 2FA."
                                        : "Add an extra layer of security to your account."}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant={user?.isMfaEnabled ? "outline" : "primary"}
                            onClick={() => user?.isMfaEnabled ? handleDisableMfa() : setIsMfaSetupOpen(true)}
                        >
                            {user?.isMfaEnabled ? "Disable 2FA" : "Enable 2FA"}
                        </Button>
                    </div>
                </div>

                {/* Company Policy */}
                <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Company Policy</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-white">
                        <div>
                            <p className="text-sm font-bold text-surface-900">Enforce MFA for all users</p>
                            <p className="text-xs text-surface-900/70">NITDA Mandate Requirement</p>
                        </div>
                        <Toggle
                            checked={companySettings?.mfaRequired ?? false}
                            onToggleChange={handleEnforceMfaToggle}
                            disabled={!currentCompany?.id || isUpdatingPolicy}
                        />
                    </div>
                </div>

                {/* Session Management */}
                <div className="space-y-4 pt-4 border-t border-surface-100">
                    <h3 className="text-sm font-bold text-surface-900">Session Management</h3>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Session Timeout</label>
                        <Select>
                            <option>1 hour</option>
                            <option>2 hours</option>
                            <option>4 hours</option>
                            <option>8 hours</option>
                        </Select>
                        <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium mt-1">
                            <Clock className="h-3.5 w-3.5" />
                            After this period of inactivity, users will be automatically logged out
                        </div>
                    </div>
                </div>
            </section>

            <MfaSetupModal isOpen={isMfaSetupOpen} onClose={() => setIsMfaSetupOpen(false)} />
            <DisableMfaModal isOpen={isDisableOpen} onClose={() => setIsDisableOpen(false)} />
        </div>
    );
};

const AddUserModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd?: (user: Record<string, unknown>) => void }) => {
    if (!isOpen) return null;

    const handleAdd = () => {
        // For now, mock it.
        if (onAdd) {
            onAdd({
                name: "New User",
                email: "new.user@example.com",
                role: "User",
                initials: "NU",
                roleColor: "bg-success-50 text-success-500"
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-6">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-surface-900">
                    <X className="h-5 w-5" />
                </button>
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-bold text-primary-700 font-serif">Add New User</h2>
                    <p className="text-sm text-surface-500">Add a new user to to account</p>
                </div>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Name *</label>
                        <Input placeholder="Full Name" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Email *</label>
                        <Input placeholder="example@acmemfg.com" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Role*</label>
                        <Select>
                            <option>User</option>
                            <option>Admin</option>
                            <option>Viewer</option>
                        </Select>
                    </div>
                </div>
                <div className="space-y-4">
                    <Button className="w-full font-bold h-11" onClick={handleAdd}>Add User</Button>
                    <p className="text-xs text-center text-surface-500 flex items-center justify-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full bg-primary-500 text-white flex items-center justify-center text-[8px] font-bold">i</div>
                        A link will be sent to the new user Email to set up their account
                    </p>
                </div>
            </div>
        </div>
    );
};

interface SettingsUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

const EditUserModal = ({ isOpen, onClose, user, onDeleteClick }: { isOpen: boolean; onClose: () => void; user: SettingsUser | null; onDeleteClick: () => void }) => {
    if (!isOpen || !user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-8">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-surface-900">
                    <X className="h-5 w-5" />
                </button>
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold text-primary-700 font-serif">{user.name}</h2>
                    <p className="text-sm text-surface-500">{user.email}</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-surface-900">Role*</label>
                    <Select defaultValue={user.role}>
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="Viewer">Viewer</option>
                    </Select>
                </div>
                <div className="space-y-6">
                    <Button className="w-full font-bold h-11" onClick={onClose}>Save Changes</Button>
                    <button onClick={onDeleteClick} className="w-full text-center text-xs font-bold text-danger-500 hover:text-danger-600 flex items-center justify-center gap-1.5">
                        <div className="h-3.5 w-3.5 rounded-full bg-danger-500 text-white flex items-center justify-center text-[8px] font-bold">i</div>
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteUserModal = ({ isOpen, onClose, user, onConfirm }: { isOpen: boolean; onClose: () => void; user: SettingsUser | null; onConfirm: () => void }) => {
    if (!isOpen || !user) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-8">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-surface-900">
                    <X className="h-5 w-5" />
                </button>
                <div className="text-center space-y-1">
                    <h2 className="text-2xl font-bold text-primary-700 font-serif">{user.name}</h2>
                    <p className="text-sm text-surface-500">{user.email}</p>
                </div>
                <p className="text-center text-danger-500 font-medium text-lg">Are you sure you want to delete user?</p>
                <div className="flex gap-4">
                    <Button variant="outline" className="flex-1 bg-surface-100 border-transparent hover:bg-surface-200 text-surface-900 font-bold h-11" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" className="flex-1 font-bold h-11 shadow-lg shadow-danger-500/20" onClick={onConfirm}>Delete User</Button>
                </div>
            </div>
        </div>
    );
};

const UserManagementTab = () => {
    const { currentCompany } = useCompanyStore();
    // Use members from store. If we want to edit locally, we'd copy to state, but for now display store.

    const [isAddOpen, setIsAddOpen] = React.useState(false);
    const [editUser, setEditUser] = React.useState<SettingsUser | null>(null);
    const [deleteUser, setDeleteUser] = React.useState<SettingsUser | null>(null);
    const { toast } = useToast();

    // Map company members to display format
    const users = currentCompany?.members?.map(m => ({
        id: m.id,
        name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.email.split('@')[0], // Fallback name
        email: m.email,
        role: m.roles && m.roles.length > 0 ? m.roles[0] : 'User',
        initials: (m.firstName && m.lastName) ? `${m.firstName[0]}${m.lastName[0]}` : m.email.substring(0, 2).toUpperCase(),
        roleColor: m.roles && m.roles.includes('admin') ? "bg-primary-50 text-primary-500" : "bg-success-50 text-success-500",
        original: m
    })) || [];

    return (
        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-900 font-serif">User Management</h2>
                        <p className="text-surface-900/70 text-sm">Manage team members and their permissions</p>
                    </div>
                </div>
                <Button className="gap-2 h-11 px-6 font-bold shadow-md shadow-primary-500/20" onClick={() => setIsAddOpen(true)}>
                    <UserPlus className="h-4 w-4" />
                    Add User
                </Button>
            </header>

            <section className="space-y-4">
                {users.map((user, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-surface-100 hover:border-primary-100 transition-all group">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-4 ring-primary-50">
                                {user.initials}
                            </div>
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-bold text-surface-900">{user.name}</p>
                                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", user.roleColor)}>
                                        {user.role}
                                    </span>
                                </div>
                                <p className="text-xs text-surface-900/70 font-medium">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="outline" className="h-9 px-4 gap-2 text-xs font-bold border-surface-200" onClick={() => setEditUser(user)}>
                                <Edit3 className="h-3.5 w-3.5 text-primary-500" />
                                Edit
                            </Button>
                            <Button variant="danger" className="h-9 px-4 gap-2 text-xs font-bold bg-danger-50 text-danger-500 border-none hover:bg-danger-100" onClick={() => setDeleteUser(user)}>
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete User
                            </Button>
                        </div>
                    </div>
                ))}
            </section>

            <section className="pt-6 border-t border-surface-100 space-y-4">
                <h3 className="text-sm font-bold text-surface-900">Role Permissions</h3>
                <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium bg-primary-50/30 p-3 rounded-lg border border-primary-50">
                    <Info className="h-3.5 w-3.5" />
                    Admin: Full access • User: Create/View invoices • Viewer: Read-only access
                </div>
            </section>

            <AddUserModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                onAdd={(newUser) => console.log("Add user not implemented via store yet", newUser)}
            />
            <EditUserModal
                isOpen={!!editUser}
                onClose={() => setEditUser(null)}
                user={editUser}
                onDeleteClick={() => {
                    setDeleteUser(editUser);
                    setEditUser(null);
                }}
            />
            <DeleteUserModal
                isOpen={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                user={deleteUser}
                onConfirm={() => {
                    toast({ title: "Not Implemented", description: "Delete user not connected to API yet", variant: "warning" });
                    setDeleteUser(null);
                }}
            />
        </div>
    );
};

const DangerZoneTab = () => {
    const { clearLogs } = useLogStore();
    const { currentCompany, resetApiConfig, deleteCompany } = useCompanyStore();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [clearLogsOpen, setClearLogsOpen] = React.useState(false);
    const [resetApiOpen, setResetApiOpen] = React.useState(false);
    const [deleteCompanyOpen, setDeleteCompanyOpen] = React.useState(false);

    const handleConfirmClearLogs = async () => {
        await clearLogs();
        toast({ title: "Logs cleared", description: "System logs have been permanently deleted.", variant: "success" });
        setClearLogsOpen(false);
    };

    const handleConfirmResetApiConfig = async () => {
        if (!currentCompany?.id) return;
        try {
            await resetApiConfig(currentCompany.id);
            toast({
                title: "API configuration reset",
                description: "New TEST and LIVE keys were generated and all webhooks were disabled.",
                variant: "success",
            });
        } catch {
            toast({ title: "Couldn't reset API configuration", variant: "error" });
        }
    };

    const handleConfirmDeleteCompany = async () => {
        if (!currentCompany?.id) return;
        try {
            await deleteCompany(currentCompany.id, currentCompany.name);
            toast({ title: "Company deleted", description: `${currentCompany.name} has been permanently deleted.`, variant: "success" });
            // Auto-switches to another company if one remains (handled in the
            // store); only leave Settings if none are left to fall back to.
            if (!useCompanyStore.getState().currentCompany) {
                navigate("/onboarding");
            }
        } catch {
            toast({ title: "Couldn't delete company", description: "Failed to delete this company.", variant: "error" });
        }
    };

    return (
        <div className="bg-danger-50/30 rounded-2xl border border-danger-100 shadow-sm p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <header className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-danger-50 flex items-center justify-center text-danger-500 shadow-sm border border-danger-100">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-danger-600 font-serif">Danger Zone</h2>
                    <p className="text-danger-500/70 text-sm font-medium">These actions are irreversible. Please proceed with caution.</p>
                </div>
            </header>

            <section className="space-y-4">
                <div className="flex items-center justify-between p-6 rounded-xl border border-surface-100 bg-white shadow-sm ring-1 ring-black/5 hover:ring-danger-500/20 transition-all">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-danger-600">Clear All Logs</p>
                        <p className="text-xs text-surface-900/70 font-medium">Permanently delete all system and audit logs</p>
                    </div>
                    <Button
                        variant="danger"
                        className="gap-2 h-11 px-6 font-bold shadow-lg shadow-danger-500/10"
                        onClick={() => setClearLogsOpen(true)}
                    >
                        <Trash2 className="h-4 w-4" />
                        Clear Logs
                    </Button>
                </div>

                <div className="flex items-center justify-between p-6 rounded-xl border border-surface-100 bg-white shadow-sm ring-1 ring-black/5 hover:ring-danger-500/20 transition-all">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-danger-600">Reset API Configuration</p>
                        <p className="text-xs text-surface-900/70 font-medium">Regenerate TEST and LIVE API keys and disable all webhooks</p>
                    </div>
                    <Button
                        variant="danger"
                        className="gap-2 h-11 px-6 font-bold shadow-lg shadow-danger-500/10"
                        onClick={() => setResetApiOpen(true)}
                        disabled={!currentCompany?.id}
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>

                <div className="flex items-center justify-between p-6 rounded-xl border border-surface-100 bg-white shadow-sm ring-1 ring-black/5 hover:ring-danger-500/20 transition-all">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-danger-600">Delete Company Account</p>
                        <p className="text-xs text-surface-900/70 font-medium">Permanently delete this company account and all data</p>
                    </div>
                    <Button
                        variant="danger"
                        className="gap-2 h-11 px-6 font-bold shadow-lg shadow-danger-500/10"
                        onClick={() => setDeleteCompanyOpen(true)}
                        disabled={!currentCompany?.id}
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete Account
                    </Button>
                </div>
            </section>

            <ConfirmModal
                isOpen={clearLogsOpen}
                onClose={() => setClearLogsOpen(false)}
                onConfirm={handleConfirmClearLogs}
                title="Clear All Logs"
                description="Are you sure you want to clear all system logs? This action cannot be undone."
                confirmText="Clear Logs"
            />

            <ConfirmModal
                isOpen={resetApiOpen}
                onClose={() => setResetApiOpen(false)}
                onConfirm={handleConfirmResetApiConfig}
                title="Reset API Configuration?"
                description="This immediately generates new TEST and LIVE API keys and disables every webhook. Anything using the current keys or webhooks will stop working right away."
                confirmText="Reset Configuration"
            />

            <ConfirmModal
                isOpen={deleteCompanyOpen}
                onClose={() => setDeleteCompanyOpen(false)}
                onConfirm={handleConfirmDeleteCompany}
                title="Delete Company Account?"
                description="This permanently deletes this company and all of its data. This cannot be undone."
                confirmText="Delete Company"
                confirmationValue={currentCompany?.name}
            />
        </div >
    );
};
