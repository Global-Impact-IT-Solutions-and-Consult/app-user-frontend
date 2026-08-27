import { useState, useEffect, useCallback } from "react";
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
import { useAuthStore } from "../store/authStore";
import { Smartphone } from "lucide-react";

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const { createCompany, isLoading, error } = useCompanyStore();
    const [step, setStep] = useState(1);
    const totalSteps = 3; // 1. Company, 2. Security, 3. API/Done

    // Shared state for company form
    const [companyData, setCompanyData] = useState({
        name: "",
        legalName: "",
        businessType: "",
        taxId: "",
        registeredAddress: "",
        contactPhone: "",
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
            await createCompany({
                name: companyData.name,
                legalName: companyData.legalName,
                taxId: companyData.taxId,
                businessType: companyData.businessType || undefined,
                industry: companyData.industry || undefined,
                registeredAddress: companyData.registeredAddress || undefined,
                contactPerson: companyData.contactPerson || undefined,
                contactEmail: companyData.contactEmail || undefined,
                contactPhone: companyData.contactPhone || undefined,
            });
            nextStep(); // Move to success/next step
        } catch {
            // console.error(_e);
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
                                {step === 1 && "Onboard Your Company"}
                                {step === 2 && "Secure Your Account"}
                                {step === 3 && "Setup Complete"}
                            </h1>
                            <p className="text-surface-500 font-medium">
                                {step === 1 && "Complete your business profile to generate your unique Business ID and begin using the e-invoicing network."}
                                {step === 2 && "Configure Multi-Factor Authentication (MFA) to protect your account."}
                                {step === 3 && "You are ready to start exchanging invoices."}
                            </p>
                        </div>
                        <div className="text-surface-400 font-bold text-sm bg-surface-50 px-3 py-1.5 rounded-full">
                            step {step} of {totalSteps}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-10 py-6 bg-surface-50/50">
                        <div className="flex gap-4">
                            {[1, 2, 3].map(i => (
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
                            <span className={cn(step === 2 ? "opacity-100" : "opacity-0 hidden")}>MFA</span>
                            <span className={cn(step === 3 ? "opacity-100" : "opacity-0 hidden")}>API Setup</span>
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
                        {step === 2 && <SecurityStep onComplete={nextStep} />}
                        {step === 3 && <APISetupStep />}
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
                        ) : step === 3 ? (
                            <Button onClick={handleComplete} className="px-10 h-12 gap-2 text-base">
                                Go to Dashboard <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={nextStep} className="text-surface-500 hover:text-surface-900">Skip for now</Button>
                            </div>
                        )}
                    </div>
                </Card>

            </div>
        </div>
    );
}

function CompanyInfoStep({ data, updateData }: {
    data: {
        legalName: string;
        name: string;
        businessType: string;
        taxId: string;
        registeredAddress: string;
        contactPhone: string;
        contactPerson: string;
        contactEmail: string;
        industry: string;
    }, updateData: (f: string, v: string) => void
}) {
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
                                className="flex h-11 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-surface-900"
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
                                value={data.registeredAddress}
                                onChange={(e) => updateData("registeredAddress", e.target.value)}
                            />
                        </div>
                        <Input
                            label="Primary Contact Phone"
                            placeholder="+234..."
                            icon={<Phone className="h-4 w-4" />}
                            value={data.contactPhone}
                            onChange={(e) => updateData("contactPhone", e.target.value)}
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
    const { currentCompany, companySettings, fetchWebhooks, createWebhook, updateWebhook, webhooks, isLoading, regenerateApiKey } = useCompanyStore();
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
    const currentSettings = companySettings?.settings?.find(s => s.type === env);
    const apiKey = currentSettings?.publicKey;

    // Filter for active webhooks in the current environment
    const activeWebhook = webhooks.find(w => w.environment === env && w.isActive);

    // Prefill webhook URL when active webhook changes or env switches
    // Prefill webhook URL when active webhook changes or env switches
    useEffect(() => {
        if (activeWebhook) {
            // eslint-disable-next-line
            setWebhookUrl(activeWebhook.url);
        } else {

            setWebhookUrl("");
        }
    }, [activeWebhook]);
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

    const generateKey = async () => {
        if (currentCompany?.id) {
            await regenerateApiKey(currentCompany.id, 'test');
            setShowKey(true);
            setTimeout(() => setShowKey(false), 2000);
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
                const result = await createWebhook(currentCompany.id, {
                    url: webhookUrl,
                    environment: env,
                    events: ["receipt.created", "receipt.paid"],
                });
                setNewWebhookSecret(result.signingSecret || null);
                setWebhookUrl(result.url);
                setWebhookCopied(false);
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
                        className="p-6 border-2 border-surface-200 bg-surface-50 opacity-50 cursor-not-allowed"
                    >
                        <div className="space-y-4">
                            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-surface-100 text-surface-400">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-surface-900">Live Environment</h4>
                                <p className="text-xs text-surface-500 leading-relaxed">
                                    Connect to production NRS for real transactions. Requires official certification and live credentials.
                                </p>
                                <Badge variant="gray" className="bg-surface-200 text-surface-500 border-none font-bold">Coming Soon</Badge>
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
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white gap-2 text-primary-500 border-surface-200"
                                onClick={() => generateKey()}
                                >
                                Generate Key
                            </Button>
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

function SecurityStep({ onComplete }: { onComplete: () => void }) {
    const { setupMfa, enableMfa } = useAuthStore();
    const [method, setMethod] = useState<'app' | 'email'>('app');
    const [step, setStep] = useState<'selection' | 'setup' | 'verify' | 'success'>('selection');

    // Setup state
    const [qrCode, setQrCode] = useState("");
    const [secret, setSecret] = useState("");
    const [entryKey, setEntryKey] = useState("");

    // Verify state
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleMethodSelect = (m: 'app' | 'email') => {
        setMethod(m);
    };

    const initSetup = useCallback(async () => {
        setStep('setup');
        setError(null);
        try {
            const data = await setupMfa();
            setQrCode(data.qrCode);
            setSecret(data.secret);
            setEntryKey(data.manualEntryKey);
        } catch {
            setError("Failed to initialize MFA setup. Please try again.");
        }
    }, [setupMfa]);

    useEffect(() => {
        if (method === 'app') {
            initSetup();
        }
    }, [method, initSetup]);

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) return;
        setIsLoading(true);
        setError(null);
        try {
            await enableMfa(otp, secret);
            setStep('success');
            setTimeout(() => {
                onComplete();
            }, 1000);
        } catch {
            setError("Invalid verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-surface-900">Please select your preferred method.</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                    className={cn(
                        "p-6 rounded-xl border-2 cursor-pointer transition-all space-y-4",
                        method === 'app' ? "border-primary-500 bg-primary-50/10" : "border-surface-200 bg-white hover:border-surface-300"
                    )}
                    onClick={() => handleMethodSelect('app')}
                >
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-primary-500 rounded-lg flex items-center justify-center text-white shrink-0">
                            <Smartphone className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-surface-900">Authenticator App (Recommended)</h4>
                            <p className="text-xs text-surface-500 leading-relaxed">
                                Use apps like Google Authenticator, Microsoft Authenticator, or Authy. Provides the highest level of security.
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    className={cn(
                        "p-6 rounded-xl border-2 cursor-pointer transition-all space-y-4",
                        method === 'email' ? "border-primary-500 bg-primary-50/10" : "border-surface-200 bg-white hover:border-surface-300"
                    )}
                    onClick={() => handleMethodSelect('email')}
                >
                    <div className="flex items-start gap-4">
                        <div className="h-10 w-10 bg-surface-100 rounded-lg flex items-center justify-center text-surface-500 shrink-0">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-surface-900">Email Verification</h4>
                            <p className="text-xs text-surface-500 leading-relaxed">
                                Receive a verification code via email each time you sign in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {method === 'app' && (
                <div className="bg-surface-50 rounded-xl p-8 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col md:flex-row gap-12">
                        {/* Instructions */}
                        <div className="flex-1 space-y-6">
                            <div className="bg-primary-50 px-4 py-3 rounded-lg">
                                <h4 className="font-bold text-surface-900 text-sm">Step by Step Guide</h4>
                            </div>
                            <ol className="space-y-5">
                                <li className="flex gap-4 text-sm text-surface-600 items-start">
                                    <span className="h-6 w-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-[10px] font-bold text-surface-700 shrink-0 shadow-sm mt-0.5">1</span>
                                    <span className="leading-tight pt-1">Install Google authenticator app on your phone.</span>
                                </li>
                                <li className="flex gap-4 text-sm text-surface-600 items-start">
                                    <span className="h-6 w-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-[10px] font-bold text-surface-700 shrink-0 shadow-sm mt-0.5">2</span>
                                    <span className="leading-tight pt-1">Tap the "+" button to add a new account.</span>
                                </li>
                                <li className="flex gap-4 text-sm text-surface-600 items-start">
                                    <span className="h-6 w-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-[10px] font-bold text-surface-700 shrink-0 shadow-sm mt-0.5">3</span>
                                    <span className="leading-tight pt-1">Scan the QR code with your phone's camera.</span>
                                </li>
                                <li className="flex gap-4 text-sm text-surface-600 items-start">
                                    <span className="h-6 w-6 bg-white border border-surface-200 rounded-full flex items-center justify-center text-[10px] font-bold text-surface-700 shrink-0 shadow-sm mt-0.5">4</span>
                                    <span className="leading-tight pt-1">Enter the 6-digit code generated by the app below to verify.</span>
                                </li>
                            </ol>

                            <div className="space-y-2 pt-4">
                                <label className="text-xs font-bold text-surface-900 uppercase tracking-wider">Verification Code</label>
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="000 000"
                                        className="font-mono tracking-[0.2em] text-center text-lg h-12 w-48 bg-white border-surface-300 focus:border-primary-500 focus:ring-primary-500"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    />
                                    <Button
                                        onClick={handleVerify}
                                        disabled={otp.length !== 6 || isLoading}
                                        className={cn("px-8 h-12 font-bold", step === 'success' ? "bg-success-500 hover:bg-success-600" : "")}
                                    >
                                        {isLoading ? "Verifying..." : step === 'success' ? "Verified" : "Verify"}
                                    </Button>
                                </div>
                                {error && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-red-500 inline-block" />{error}</p>}
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                                <p className="text-xs text-blue-800 leading-relaxed">
                                    <span className="font-bold">Note:</span> Your selection can be changed later in your account security settings. We strongly recommend using an Authenticator App for optimal protection of your e-invoicing data.
                                </p>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-6 pt-4">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-surface-200">
                                {qrCode ? (
                                    <img src={qrCode} alt="MFA QR Code" className="h-44 w-44" />
                                ) : (
                                    <div className="h-44 w-44 flex items-center justify-center bg-surface-50 text-surface-400 text-xs text-center p-4 rounded-xl border border-dashed border-surface-200">
                                        Loading QR code...
                                    </div>
                                )}
                            </div>

                            <div className="bg-surface-100 py-3 px-4 rounded-lg text-center space-y-1 max-w-[200px]">
                                <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider">Manual Entry Key</p>
                                <p className="text-xs font-mono font-medium text-surface-600 break-all select-all cursor-text text-center">
                                    {entryKey || "Loading..."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {method === 'email' && (
                <div className="bg-surface-50 rounded-xl p-10 animate-in slide-in-from-top-2 duration-300 border border-surface-200 text-center space-y-6">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center text-primary-500 mx-auto shadow-sm">
                        <Mail className="h-8 w-8" />
                    </div>
                    <div className="space-y-2 max-w-md mx-auto">
                        <h4 className="text-lg font-bold text-surface-900">Email Verification is Active</h4>
                        <p className="text-sm text-surface-600 leading-relaxed">
                            Your account is currently protected by email verification. We will send a one-time code to <b>{useAuthStore.getState().user?.email}</b> whenever a new login is detected.
                        </p>
                    </div>
                    <div className="pt-2">
                        <Button onClick={onComplete} className="px-8 min-w-[200px]">
                            Continue with Email Verification
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
