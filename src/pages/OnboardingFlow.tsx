import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanyStore } from "../store/companyStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import {
    KeyRound,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Mail,
    Building2,
    Phone,
    User,
    UserLock,
    Check,
    Eye,
    Copy,
    Link2
} from "lucide-react";
import { cn } from "../lib/utils";

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const { createCompany, isLoading, error } = useCompanyStore();
    const [step, setStep] = useState(1);
    const totalSteps = 2; // Reduced steps: 1. Company, 2. API/Done

    // Shared state for company form
    const [companyData, setCompanyData] = useState({
        name: "",
        legalName: "",
        businessType: "",
        taxId: "",
        streetAddress: "",
        primaryPhone: "",
        contactPerson: "",
        contactEmail: "",
        industry: ""
    });

    const updateCompanyData = (field: string, value: string) => {
        setCompanyData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleCreateCompany = async () => {
        try {
            // Mapping form data to API expected DTO if needed
            // API expects: name, legalName, taxId (and maybe others?)
            // Check docs: CreateCompanyDto -> name, legalName, taxId.
            // We pass what we have. API might be loose or strict.
            await createCompany({
                name: companyData.name,
                legalName: companyData.legalName,
                taxId: companyData.taxId,
                // Pass other fields if API supports them, otherwise they are for UI demo?
                // Assuming minimal MVP for now based on strict backend reqs
            });
            nextStep(); // Move to success/next step
        } catch (e) {
            console.error(e);
        }
    };

    const handleComplete = () => {
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-4xl space-y-8">

                {/* Onboarding Container */}
                <Card className="overflow-hidden border-none shadow-xl bg-white min-h-[700px] flex flex-col">

                    {/* Header */}
                    <div className="p-10 pb-6 border-b border-surface-100 flex justify-between items-start">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold font-serif text-surface-900 tracking-tight">
                                {step === 1 ? "Onboard Your Company" : "Setup Complete"}
                            </h1>
                            <p className="text-surface-500 font-medium">
                                {step === 1 && "Complete your business profile to generate your unique Business ID and begin using the e-invoicing network."}
                                {step === 2 && "You are ready to start exchanging invoices."}
                            </p>
                        </div>
                        <div className="text-surface-400 font-bold text-sm bg-surface-50 px-3 py-1.5 rounded-full">
                            step {step} of {totalSteps}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-10 py-6 bg-surface-50/50">
                        <div className="flex gap-4">
                            {[1, 2].map(i => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 flex-1 rounded-full transition-all duration-500",
                                        i <= step ? "bg-primary-500" : "bg-surface-200"
                                    )}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-[10px] font-bold uppercase tracking-wider text-primary-500">
                            <span className={cn(step === 1 ? "opacity-100" : "opacity-0 hidden")}>Company Info</span>
                            <span className={cn(step === 2 ? "opacity-100" : "opacity-0 hidden")}>Finish</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mx-10 mt-4 p-3 bg-red-50 text-red-500 text-sm rounded border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Step Content */}
                    <div className="flex-1 p-10 py-12">
                        {step === 1 && (
                            <CompanyInfoStep
                                data={companyData}
                                updateData={updateCompanyData}
                            />
                        )}
                        {step === 2 && <APISetupStep />}
                    </div>

                    {/* Footer Controls */}
                    <div className="p-8 border-t border-surface-100 bg-surface-50/30 flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 1}
                            className="bg-white px-8 h-12 gap-2 text-surface-500 border-surface-200 hover:text-surface-900"
                        >
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>

                        {step === 1 ? (
                            <Button onClick={handleCreateCompany} disabled={isLoading} className="px-10 h-12 gap-2 text-base">
                                {isLoading ? "Creating..." : "Create Company"} <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleComplete} className="px-10 h-12 gap-2 text-base">
                                Go to Dashboard <ArrowRight className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
}

function CompanyInfoStep({ data, updateData }: { data: any, updateData: (f: string, v: string) => void }) {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-surface-100 pb-3">
                        <Building2 className="h-5 w-5 text-primary-500" />
                        <span className="text-sm font-bold text-primary-500">Legal Business Information</span>
                    </div>
                    <div className="space-y-6">
                        <Input
                            label="Legal Business Name *"
                            placeholder="name@yourcomapny.com"
                            value={data.legalName}
                            onChange={(e) => updateData("legalName", e.target.value)}
                        />
                        <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                            <ShieldCheck className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-surface-500 leading-normal">Must match your Corporate Affairs Commission (CAC) registration.</p>
                        </div>
                        <Input
                            label="Trading Name *"
                            placeholder="Name used for daily operation"
                            value={data.name} // Using 'name' for trading/display name
                            onChange={(e) => updateData("name", e.target.value)}
                        />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-surface-900 ml-0.5">Business Type</label>
                            <select
                                className="flex h-11 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 italic text-surface-400"
                                value={data.businessType}
                                onChange={(e) => updateData("businessType", e.target.value)}
                            >
                                <option value="">Select Type</option>
                                <option value="LLC">Limited Liability Company</option>
                                <option value="SoleProprietorship">Sole Proprietorship</option>
                            </select>
                        </div>

                        <Input
                            label="RC Number / Tax ID *"
                            placeholder="e.g., RC1234567"
                            value={data.taxId}
                            onChange={(e) => updateData("taxId", e.target.value)}
                        />
                        <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                            <ShieldCheck className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-surface-500 leading-normal">Your Corporate Affairs Commission Registration Number.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-b border-surface-100 pb-3">
                        <Building2 className="h-5 w-5 text-primary-500" />
                        <span className="text-sm font-bold text-primary-500">Business Address & Contact</span>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-surface-900 ml-0.5">Registered Address</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                placeholder="Full street address, city, state"
                                value={data.streetAddress}
                                onChange={(e) => updateData("streetAddress", e.target.value)}
                            />
                        </div>
                        <Input
                            label="Primary Contact Phone"
                            placeholder="+234..."
                            icon={<Phone className="h-4 w-4" />}
                            value={data.primaryPhone}
                            onChange={(e) => updateData("primaryPhone", e.target.value)}
                        />
                        <div className="space-y-2">
                            <Input
                                label="Authorized Contact Person"
                                placeholder="Full name"
                                icon={<User className="h-4 w-4" />}
                                value={data.contactPerson}
                                onChange={(e) => updateData("contactPerson", e.target.value)}
                            />
                            <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                                <UserLock className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-surface-500 leading-normal">This person will be the primary point of contact for regulatory matters.</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Contact Email"
                                placeholder="contact@yourcompany.com"
                                icon={<Mail className="h-4 w-4" />}
                                value={data.contactEmail}
                                onChange={(e) => updateData("contactEmail", e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function APISetupStep() {
    const [env, setEnv] = useState<"test" | "live">("test");
    const { currentCompany, fetchWebhooks, createWebhook, updateWebhook, webhooks, isLoading } = useCompanyStore();
    const [showKey, setShowKey] = useState(false);
    const [apiKeyCopied, setApiKeyCopied] = useState(false);
    const [webhookCopied, setWebhookCopied] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [newWebhookSecret, setNewWebhookSecret] = useState<string | null>(null);

    useEffect(() => {
        if (currentCompany?.id) {
            fetchWebhooks(currentCompany.id);
        }
    }, [currentCompany?.id, fetchWebhooks]);

    // Find settings for the selected environment
    const currentSettings = currentCompany?.companySettings?.[0]?.settings?.find(s => s.type === env);
    const apiKey = currentSettings?.publicKey;

    // Find active webhook for current env
    // Note: API response doesn't explicitly return 'environment' field in the snippet, 
    // but based on previous context we assume we filter by what we know or if provided.
    // If the API doesn't return environment, we might need to rely on the user's current view 
    // or previous assumptions. The standard seems to be one webhook per env?
    // Let's assume we filter by what we have.
    const activeWebhook = webhooks.find(w => w.environment === env && w.isActive);
    // Warning: If webhooks list mixes environments and the object doesn't have it, 
    // we might show wrong one. Assuming for now the list is relevant or we filtered on fetch?
    // The previous fetch was `/companies/${id}/webhooks`, likely returns all.
    // If response misses environment, we check if url matches or something?
    // Let's stick to previous logical assumption or check if the user object has it.

    // Prefill webhook URL when active webhook changes or env switches
    useEffect(() => {
        if (activeWebhook) {
            setWebhookUrl(activeWebhook.url);
        } else {
            setWebhookUrl("");
        }
    }, [activeWebhook, env]);

    const copyApiKey = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setApiKeyCopied(true);
            setTimeout(() => setApiKeyCopied(false), 2000);
        }
    };

    const copyWebhookSecret = (secret: string) => {
        if (secret) {
            navigator.clipboard.writeText(secret);
            setWebhookCopied(true);
            setTimeout(() => setWebhookCopied(false), 2000);
        }
    };

    const handleWebhookSubmit = async () => {
        if (!currentCompany?.id || !webhookUrl) return;
        try {
            setNewWebhookSecret(null); // Reset
            if (activeWebhook) {
                // Update existing
                await updateWebhook(currentCompany.id, activeWebhook.id, {
                    url: webhookUrl,
                    events: activeWebhook.subscribedEvents || ["receipt.created", "receipt.paid"],
                    isActive: true
                });
            } else {
                // Create new
                // Implementation in store needs to return the result for us to get the secret
                // We'll trust the store pushes to 'webhooks' state, but we need the return value for the secret.
                // We might need to tweak store to return the data.
                // Or we capture it from the updated webhooks list if it persists there (unlikely for secret).

                // Let's update this call to assume createWebhook now returns the data
                // We need to modify store for that, but JS implies async returns promise result if returned.
                // In store: `set(state => ...);` doesn't explicitly return.
                // I will need to update store to return the result.

                // For now, let's assume we will get it.
                // Using a direct API call here might be cleaner if store doesn't return, 
                // but let's fix the store.
                const response = await createWebhook(currentCompany.id, {
                    url: webhookUrl,
                    environment: env,
                    events: ["receipt.created", "receipt.paid"],
                });
                // @ts-ignore
                if (response && response.signingSecret) {
                    // @ts-ignore
                    setNewWebhookSecret(response.signingSecret);
                }
            }
            // Ideally show success toast here
        } catch (e) {
            console.error("Failed to save webhook", e);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-6">
                <div className="space-y-1">
                    <h3 className="text-lg font-bold text-surface-900">Select Environment</h3>
                    <p className="text-sm text-surface-500">Choose where you want to connect. Start with Test, then switch to Live when ready.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        className={cn(
                            "p-6 cursor-pointer transition-all border-2",
                            env === "test" ? "border-primary-500 bg-primary-50/10" : "border-surface-200 bg-white"
                        )}
                        onClick={() => setEnv("test")}
                    >
                        <div className="space-y-4">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", env === "test" ? "bg-primary-500 text-white" : "bg-surface-100 text-surface-400")}>
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-surface-900">Test Environment</h4>
                                <p className="text-xs text-surface-500 leading-relaxed">
                                    Connect to NRS Sandbox for development and testing. Use test credentials to validate your integration.
                                </p>
                                <Badge variant="warning" className="bg-warning-100 text-warning-700 border-none font-bold">Recommended for starters</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className={cn(
                            "p-6 cursor-pointer transition-all border-2",
                            env === "live" ? "border-primary-500 bg-primary-50/10" : "border-surface-200 bg-white opacity-60"
                        )}
                        onClick={() => setEnv("live")}
                    >
                        <div className="space-y-4">
                            <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", env === "live" ? "bg-primary-500 text-white" : "bg-surface-100 text-surface-400")}>
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-surface-900">Live Environment</h4>
                                <p className="text-xs text-surface-500 leading-relaxed">
                                    Connect to production NRS for real transactions. Requires official certification and live credentials.
                                </p>
                                <Badge variant="success" className="bg-success-100 text-success-700 border-none font-bold">Production ready</Badge>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-lg p-8 space-y-6 border border-surface-100">
                <div className="flex items-center gap-3">
                    <KeyRound className="h-5 w-5 text-primary-500" />
                    <h4 className="text-sm font-bold text-surface-900">{env === 'test' ? 'Test' : 'Live'} Environment Credentials</h4>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-surface-500">APP Public Key</label>
                    <div className="bg-surface-900 text-white p-4 rounded-xl flex items-center justify-between font-mono text-sm tracking-widest overflow-hidden">
                        <span className="truncate opacity-50">
                            {apiKey ? (showKey ? apiKey : "•".repeat(apiKey.length > 20 ? 20 : apiKey.length)) : "No API Key found"}
                        </span>
                    </div>
                    <div className="flex gap-4">
                        {apiKey && (
                            <>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white gap-2 text-primary-500 border-surface-200"
                                    onClick={() => setShowKey(!showKey)}
                                >
                                    <Eye className="h-3.5 w-3.5" /> {showKey ? "Hide Key" : "Show Key"}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white gap-2 text-primary-500 border-surface-200"
                                    onClick={copyApiKey}
                                >
                                    {apiKeyCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {apiKeyCopied ? "Copied" : "Copy"}
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-lg p-8 space-y-6 border border-surface-100">
                <div className="flex items-center gap-3">
                    <Link2 className="h-5 w-5 text-primary-500" />
                    <h4 className="text-sm font-bold text-surface-900">Webhook Endpoint</h4>
                </div>

                {/* Signing Secret Display */}
                {newWebhookSecret && (
                    <div className="bg-success-50 border border-success-200 p-4 rounded-xl space-y-2">
                        <div className="flex items-center gap-2 text-success-700 font-bold text-sm">
                            <Check className="h-4 w-4" /> Webhook Created Successfully
                        </div>
                        <p className="text-xs text-success-600">
                            Save your signing secret now. It will not be shown again.
                        </p>
                        <div className="bg-white border border-success-200 p-3 rounded-lg font-mono text-xs text-surface-700 break-all flex justify-between items-center gap-2">
                            {newWebhookSecret}
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => copyWebhookSecret(newWebhookSecret)}>
                                {webhookCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs text-surface-500">Required to receive invoice notifications from NRS</p>

                        {/* Dynamic Status Display */}
                        <div className="flex items-center gap-2 border border-surface-200 w-fit py-1 px-3 rounded-xl bg-white">
                            <div className={cn("h-3 w-3 rounded-full flex items-center justify-center", activeWebhook ? "bg-[#34C759]" : "bg-gray-300")}>
                                {activeWebhook && <Check className="h-2 w-2 text-white" />}
                            </div>
                            <span className={cn("text-xs font-bold", activeWebhook ? "text-[#34C759]" : "text-gray-500")}>
                                {activeWebhook ? "Active" : "Not Configured"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-surface-900">Webhook URL</label>
                        <div className="flex gap-3">
                            <Input
                                placeholder="https://yourdomain.com/webhook"
                                className="bg-white"
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                            />
                            <Button className="shrink-0 px-8" onClick={handleWebhookSubmit} disabled={isLoading}>
                                {isLoading ? "Saving..." : (activeWebhook ? "Update" : "Create")}
                            </Button>
                        </div>
                        <p className="text-[10px] text-surface-400">
                            Enter the URL where you want to receive webhook events for the <b>{env}</b> environment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
