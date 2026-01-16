import * as React from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Toggle } from "../components/ui/Toggle";
import {
    Building2,
    Cpu,
    Shield,
    Users,
    AlertOctagon,
    RotateCcw,
    Copy,
    Zap,
    UserPlus,
    Edit3,
    Trash2,
    AlertTriangle,
    Info,
    Clock
} from "lucide-react";
import { cn } from "../lib/utils";
import { useCompanyStore } from "../store/companyStore";
import { useLogStore } from "../store/logStore";

const tabs = [
    { label: "General", id: "general" },
    { label: "API & Webhooks", id: "api" },
    { label: "Security", id: "security" },
    { label: "User Management", id: "user-management" },
    { label: "Danger Zone", id: "danger-zone" },
];

export default function Settings() {
    const [activeTab, setActiveTab] = React.useState("general");

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

const GeneralTab = () => (
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
                        <Input defaultValue="Acme Manufacturing Limited" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Trading Name <span className="text-danger-500">*</span></label>
                        <Input defaultValue="Acme Manufacturing" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">RC Number <span className="text-danger-500">*</span></label>
                        <Input defaultValue="RC1234567" />
                    </div>
                </div>
            </section>

            <section className="space-y-4 pt-4">
                <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Contact Information</h3>
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Registered Address <span className="text-danger-500">*</span></label>
                        <textarea
                            className="w-full min-h-[100px] p-4 rounded-xl border border-surface-200 bg-surface-50 text-sm text-surface-900 placeholder:text-surface-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                            defaultValue="123 Industrial Estate, Lagos Business District, Lagos, Nigeria"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Contact Email <span className="text-danger-500">*</span></label>
                            <Input defaultValue="accounts@acmemfg.com" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-surface-900">Contact Phone <span className="text-danger-500">*</span></label>
                            <Input defaultValue="+2348012345678" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
);

const ApiTab = () => {
    const {
        currentCompany,
        apiKeys,
        webhooks,
        fetchApiKeys,
        fetchWebhooks,
        createWebhook,
        updateWebhook,
        isLoading,
        revokeApiKey,
        regenerateApiKey
    } = useCompanyStore();

    React.useEffect(() => {
        if (currentCompany?.id) {
            fetchApiKeys(currentCompany.id);
            fetchWebhooks(currentCompany.id);
        }
    }, [currentCompany?.id, fetchApiKeys, fetchWebhooks]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast success ideally
    };

    const handleRegenerateKey = async (keyId: string) => {
        if (confirm("Are you sure? Old key will stop working immediately.") && currentCompany?.id) {
            await regenerateApiKey(currentCompany.id, keyId);
        }
    };

    // Webhook Handlers (Simplified for this step)
    const handleToggleWebhook = async (webhook: any) => {
        if (currentCompany?.id) {
            await updateWebhook(currentCompany.id, webhook.id, { isActive: !webhook.isActive });
        }
    };

    if (!currentCompany) return <div className="p-8 text-center">Please select a company first.</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="bg-white rounded-2xl border border-surface-200 shadow-sm p-8 space-y-8">
                <header className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500 shadow-sm">
                        <Cpu className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-surface-900 font-serif">API Configuration</h2>
                        <p className="text-surface-900/70 text-sm">Manage your API keys and NRS connections</p>
                    </div>
                </header>

                <section className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">Environment</h3>
                        <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-white">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-surface-900">Current Environment: {currentCompany.status === 'active' ? 'Live' : 'Test'}</p>
                                <p className="text-xs text-surface-900/70">Switch between test and live environments</p>
                            </div>
                            <Toggle defaultChecked={currentCompany.status !== 'active'} />
                        </div>
                        <div className="bg-primary-50/50 p-3 rounded-lg flex items-center gap-2 border border-primary-100">
                            <Info className="h-4 w-4 text-primary-500 shrink-0" />
                            <p className="text-[11px] text-primary-700 font-medium">Test environment connects to NRS Sandbox. Live environment requires production credentials.</p>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h3 className="text-sm font-bold text-surface-900 border-b border-surface-100 pb-2">API Keys</h3>
                        <div className="space-y-3">
                            {apiKeys.length === 0 ? (
                                <p className="text-sm text-surface-500">No API keys found.</p>
                            ) : (
                                apiKeys.map((key) => (
                                    <div key={key.id} className="space-y-2">
                                        <p className="text-xs font-bold text-surface-900">{key.name} ({key.type})</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 px-4 py-3 bg-slate-900 text-slate-300 font-mono text-sm rounded-lg border border-slate-800 break-all">
                                                {key.key}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Button
                                                variant="outline"
                                                className="gap-2 h-10 px-4 text-xs font-bold border-surface-200"
                                                onClick={() => handleRegenerateKey(key.id)}
                                            >
                                                <RotateCcw className="h-4 w-4 text-primary-500" />
                                                Regenerate
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="gap-2 h-10 px-4 text-xs font-bold border-surface-200"
                                                onClick={() => handleCopy(key.key)}
                                            >
                                                <Copy className="h-4 w-4 text-primary-500" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="gap-2 h-10 px-4 text-xs font-bold bg-danger-50 text-danger-500 border-none hover:bg-danger-100 ml-auto"
                                                onClick={() => currentCompany.id && revokeApiKey(currentCompany.id, key.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Revoke
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                            {/* Placeholder for creating new key if list is empty or allow multiple? */}
                        </div>
                    </div>
                </section>
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
                    {webhooks.length === 0 ? (
                        <div className="text-center p-8 bg-surface-50 rounded-xl border border-dashed border-surface-200">
                            <p className="text-surface-500 text-sm">No webhooks configured.</p>
                            {/* Add create button/form here ideally */}
                        </div>
                    ) : (
                        webhooks.map((webhook) => (
                            <div key={webhook.id} className="space-y-4 border-b border-surface-100 pb-6 last:border-0 last:pb-0">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-surface-900">Webhook URL</label>
                                    <Input defaultValue={webhook.url} readOnly />
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-white">
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-surface-900">Active</p>
                                        <p className="text-xs text-surface-900/70">Enable or disable this webhook</p>
                                    </div>
                                    <Toggle defaultChecked={webhook.isActive} onChange={() => handleToggleWebhook(webhook)} />
                                </div>

                                {webhook.signingSecret && (
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-surface-900">Webhook Secret</label>
                                        <div className="flex gap-2">
                                            <Input type="password" value={webhook.signingSecret} readOnly className="flex-1" />
                                            <Button variant="outline" onClick={() => handleCopy(webhook.signingSecret!)}><Copy className="h-4 w-4" /></Button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium mt-1">
                                            <Shield className="h-3.5 w-3.5" />
                                            Secret for verifying signatures
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
};

const SecurityTab = () => (
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
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-surface-900">Multi-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-white">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-surface-900">MFA Required</p>
                        <p className="text-xs text-surface-900/70">Require MFA for all user logins (NITDA Mandate)</p>
                    </div>
                    <Toggle defaultChecked={true} />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-primary-600 font-medium">
                    <Info className="h-3.5 w-3.5" />
                    MFA is mandated by Section 21.i of the NITDA Guideline
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-surface-900">Default MFA Method</label>
                    <Select>
                        <option>Email Verification</option>
                        <option>SMS Authenticator</option>
                        <option>Google Authenticator</option>
                    </Select>
                </div>
            </div>

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
                <div className="flex items-center justify-between p-4 rounded-xl border border-surface-100 bg-surface-50">
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-surface-900 text-surface-500">Single Session per User</p>
                        <p className="text-xs text-surface-900/70">Allow only one active session per user account</p>
                    </div>
                    <Toggle defaultChecked={false} />
                </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-100">
                <h3 className="text-sm font-bold text-surface-900">Password</h3>
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">New Password</label>
                        <Input type="password" defaultValue="***********" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-surface-900">Confirm New Password</label>
                        <Input type="password" defaultValue="***********" />
                    </div>
                </div>
                <Button variant="outline" className="h-10 px-6 font-bold text-primary-500 border-primary-100 hover:bg-primary-50 transition-all">
                    Update Password
                </Button>
            </div>
        </section>
    </div>
);

const UserManagementTab = () => (
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
            <Button className="gap-2 h-11 px-6 font-bold shadow-md shadow-primary-500/20">
                <UserPlus className="h-4 w-4" />
                Add User
            </Button>
        </header>

        <section className="space-y-4">
            {[
                { name: "John Doe", email: "john.doe@acmemfg.com", role: "Admin", initials: "JD", roleColor: "bg-primary-50 text-primary-500" },
                { name: "Jane Smith", email: "jane.smith@acmemfg.com", role: "User", initials: "JS", roleColor: "bg-success-50 text-success-500" },
                { name: "Robert Brown", email: "robert.brown@acmemfg.com", role: "Viewer", initials: "RB", roleColor: "bg-purple-50 text-purple-500" }
            ].map((user, i) => (
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
                        <Button variant="outline" className="h-9 px-4 gap-2 text-xs font-bold border-surface-200">
                            <Edit3 className="h-3.5 w-3.5 text-primary-500" />
                            Edit
                        </Button>
                        <Button variant="danger" className="h-9 px-4 gap-2 text-xs font-bold bg-danger-50 text-danger-500 border-none hover:bg-danger-100">
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
    </div>
);

const DangerZoneTab = () => {
    const { clearLogs } = useLogStore();
    const { currentCompany } = useCompanyStore();

    const handleAction = async (title: string) => {
        if (title === "Clear All Logs") {
            if (confirm("Are you sure you want to clear all logs? This cannot be undone.")) {
                await clearLogs();
                alert("Logs cleared.");
            }
        } else {
            alert("This action is not fully implemented in this demo.");
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
                {[
                    {
                        title: "Clear All Logs",
                        desc: "Permanently delete all system and audit logs",
                        btnText: "Clear Logs",
                        icon: Trash2
                    },
                    {
                        title: "Reset API Configuration",
                        desc: "Reset all API keys and webhook settings to defaults",
                        btnText: "Reset",
                        icon: RotateCcw
                    },
                    {
                        title: "Delete Company Account",
                        desc: "Permanently delete this company account and all data",
                        btnText: "Delete Account",
                        icon: Trash2
                    }
                ].map((action, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-xl border border-surface-100 bg-white shadow-sm ring-1 ring-black/5 hover:ring-danger-500/20 transition-all">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-danger-600">{action.title}</p>
                            <p className="text-xs text-surface-900/70 font-medium">{action.desc}</p>
                        </div>
                        <Button
                            variant="danger"
                            className="gap-2 h-11 px-6 font-bold shadow-lg shadow-danger-500/10"
                            onClick={() => handleAction(action.title)}
                        >
                            <action.icon className="h-4 w-4" />
                            {action.btnText}
                        </Button>
                    </div>
                ))}
            </section>
        </div>
    );
};
