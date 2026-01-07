import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import {
    KeyRound,
    ArrowRight,
    ArrowLeft,
    ShieldCheck,
    Smartphone,
    Mail,
    Building2,
    Phone,
    User,
    Zap,
    Eye,
    Copy,
    Link2,
    Tablet,
    TabletSmartphone,
    FileWarning,
    MessageSquareWarning,
    MessageCircleWarning,
    UserLock,
    CheckCircle,
    Check
} from "lucide-react";
import { cn } from "../lib/utils";

export default function OnboardingFlow() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

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
                                {step <= 2 ? "Secure Your Account" : step === 3 ? "Onboard Your Company" : "API Setup"}
                            </h1>
                            <p className="text-surface-500 font-medium">
                                {step === 1 && "Set up your password"}
                                {step === 2 && "Configure Multi-Factor Authentication (MFA)"}
                                {step === 3 && "Complete your business profile to generate your unique Business ID and begin using the e-invoicing network."}
                                {step === 4 && "Configure your credentials to start exchanging invoices"}
                            </p>
                        </div>
                        <div className="text-surface-400 font-bold text-sm bg-surface-50 px-3 py-1.5 rounded-full">
                            step {step} of {totalSteps}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-10 py-6 bg-surface-50/50">
                        <div className="flex gap-4">
                            {[1, 2, 3, 4].map(i => (
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
                            <span className={cn(step === 1 ? "opacity-100" : "opacity-0 hidden")}>Create Password</span>
                            <span className={cn(step === 2 ? "opacity-100" : "opacity-0 hidden")}>MFA</span>
                            <span className={cn(step === 3 ? "opacity-100" : "opacity-0 hidden")}>Company Info</span>
                            <span className={cn(step === 4 ? "opacity-100" : "opacity-0 hidden")}>API Setup</span>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 p-10 py-12">
                        {step === 1 && <PasswordStep />}
                        {step === 2 && <MFAStep />}
                        {step === 3 && <CompanyInfoStep />}
                        {step === 4 && <APISetupStep />}
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

                        {step < 4 ? (
                            <Button onClick={nextStep} className="px-10 h-12 gap-2 text-base">
                                Continue <ArrowRight className="h-4 w-4" />
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

function PasswordStep() {
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);

    const calculateStrength = (val: string) => {
        if (!val) return 0;
        let s = 1;
        if (val.length >= 8 && /[A-Z]/.test(val) && /[0-9]/.test(val)) s = 2;
        if (val.length >= 12 && /[^A-Za-z0-9]/.test(val)) s = 3;
        return s;
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setPassword(val);
        setStrength(calculateStrength(val));
    };

    const strengthLabels = ["", "Weak", "Medium", "Strong"];
    const strengthColors = ["bg-surface-200", "bg-danger-500", "bg-warning-500", "bg-success-500"];

    return (
        <div className="max-w-md mx-auto space-y-8">
            <div className="flex items-center gap-3 border-b border-surface-100 pb-3">
                <KeyRound className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-normal text-surface-500">Set up Email Verification</span>
            </div>
            <div className="space-y-6">
                <Input
                    label="New Password *"
                    type="password"
                    placeholder="Minimum 12 character"
                    value={password}
                    onChange={handlePasswordChange}
                />
                <div className="space-y-2">
                    <div className="h-1 w-full bg-surface-200 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-300", strengthColors[strength])}
                            style={{ width: `${(strength / 3) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase text-surface-400">
                        <span>Password Strength</span>
                        {strength > 0 && (
                            <span className={cn(
                                strength === 1 && "text-danger-500",
                                strength === 2 && "text-warning-500",
                                strength === 3 && "text-success-500"
                            )}>
                                {strengthLabels[strength]}
                            </span>
                        )}
                    </div>
                </div>
                <Input label="Confirm New Password *" type="password" placeholder="Re-enter your password" />
            </div>
        </div>
    );
}

function MFAStep() {
    const [method, setMethod] = useState<"app" | "email">("app");

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-3 border-b border-surface-100 pb-3">
                <ShieldCheck className="h-5 w-5 text-primary-500" />
                <span className="text-sm font-bold text-surface-500">Set up Email Verification</span>
            </div>

            <div className="space-y-6">
                <p className="text-sm font-medium text-surface-500">Please select your preferred method.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card
                        className={cn(
                            "p-6 cursor-pointer transition-all hover:border-primary-500 flex items-center gap-6",
                            method === "app" ? "border-primary-500 bg-primary-50/30" : "bg-white border-surface-300"
                        )}
                        onClick={() => setMethod("app")}
                    >
                        <div className={cn("h-8 w-8 rounded-sm flex items-center justify-center shrink-0", method === "app" ? "bg-primary-500 text-white" : "bg-surface-100 text-surface-900")}>
                            <TabletSmartphone className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-surface-900 text-base">Authenticator App (Recommended)</h4>
                            <p className="text-xs text-surface-900 leading-relaxed">
                                Use apps like Google Authenticator, Microsoft Authenticator, or Authy. Provides the highest level of security.
                            </p>
                        </div>
                    </Card>

                    <Card
                        className={cn(
                            "p-6 cursor-pointer transition-all hover:border-primary-500 flex items-center gap-6",
                            method === "email" ? "border-primary-500 bg-primary-50/30" : "bg-white border-surface-300"
                        )}
                        onClick={() => setMethod("email")}
                    >
                        <div className={cn("h-8 w-8 rounded-sm flex items-center justify-center shrink-0", method === "email" ? "bg-primary-500 text-white" : "bg-surface-100 text-surface-900")}>
                            <Mail className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-surface-900 text-base">Email Verification</h4>
                            <p className="text-xs text-surface-900 leading-relaxed">
                                Receive a verification code via email each time you sign in.
                            </p>
                        </div>
                    </Card>
                </div>

                {method === "app" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6">
                        <div className="space-y-6">
                            <div className="bg-surface-100/50 p-6 rounded-xl space-y-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-surface-400">Step by Step Guid</span>
                                <div className="space-y-3">
                                    {[
                                        "Install Google authenticator app on your phone.",
                                        "tap the \"+\" button to add a new account.",
                                        "Scan the QR code with your phone's camera.",
                                        "Enter the 6-digit code generated by the app below to verify."
                                    ].map((step, i) => (
                                        <div key={i} className="flex gap-3 text-xs font-medium text-surface-500 leading-relaxed">
                                            <span className="h-5 w-5 rounded-full bg-surface-200 text-surface-400 flex items-center justify-center shrink-0 font-bold">{i + 1}</span>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-end">
                                <Input label="Verification Code" placeholder="000000" className="text-center tracking-widest font-mono h-12 w-fit" />
                                <Button variant="success" className="h-12 px-8 bg-[#34C759]">Verify</Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 bg-white">
                            <img
                                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JBSW%20Y3DP%20EHPK%203PXP"
                                alt="QR Code"
                                className="w-40 h-40 p-5 border border-surface-200 rounded-md"
                            />
                            <Badge variant="gray" className="py-2 px-4 rounded-md font-mono text-xs">JBSW Y3DP EHPK 3PXP</Badge>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col justify-center py-10 space-y-8">
                        <div className="flex justify-start items-center gap-4">
                            <div className="bg-primary-50 text-primary-500 p-4 rounded-xl flex items-start gap-4 max-w-lg">
                                <MessageCircleWarning className="h-8 w-8 fill-primary-500 text-white" />
                                <p className="text-sm font-medium leading-relaxed">
                                    A 6-digit code will be sent to your.email@example.com each time you sign in. You'll need to enter this code to complete the login process.
                                </p>
                            </div>
                        </div>
                       <div className="flex justify-between gap-3">
                            <div className="flex items-end gap-3 w-full max-w-md">
                                <Input label="Email Address" value="your.email@example.com" disabled className="h-12" />
                                <Button className="h-12 px-8 shrink-0">Send Code</Button>
                            </div>
                            <div>
                                <div className="flex justify-end gap-3 items-end w-fit max-w-md">
                                    <Input label="Verification Code" placeholder="000000" className="text-center tracking-widest font-mono h-12 w-fit px-0" maxLength={6} />
                                    <Button variant="success" className="h-12 px-8 shrink-0 bg-[#34C759]">Verify</Button>
                                </div>
                            </div>
                       </div>
                    </div>
                )}

                <div className="bg-primary-50/50 border-l-4 border-primary-500 p-6 rounded-r-xl">
                    <p className="text-xs text-surface-700 leading-relaxed">
                        <span className="text-primary-500 font-bold">Note:</span> Your selection can be changed later in your account security settings. We strongly recommend using an Authenticator App for optimal protection of your e-invoicing data.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CompanyInfoStep() {
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
                        <Input label="Legal Business Name *" placeholder="name@yourcomapny.com" />
                        <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                            <ShieldCheck className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-surface-500 leading-normal">Must match your Corporate Affairs Commission (CAC) registration.</p>
                        </div>
                        <Input label="Trading Name (if different)" placeholder="Name used for daily iperation" />

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-surface-900 ml-0.5">Business Type *</label>
                            <select className="flex h-11 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 italic text-surface-400">
                                <option>Select Type</option>
                            </select>
                        </div>

                        <Input label="RC Number / BN *" placeholder="e.g., RC1234567" />
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
                            <label className="text-sm font-medium text-surface-900 ml-0.5">Registered Address *</label>
                            <textarea
                                className="flex min-h-[100px] w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                placeholder="Full street address, city, state"
                            />
                        </div>
                        <Input label="Primary Contact Phone *" placeholder="name@yourcomapny.com" icon={<Phone className="h-4 w-4" />} />
                        <div className="space-y-2">
                            <Input label="Authorized Contact Person *" placeholder="Full name" icon={<User className="h-4 w-4" />} />
                            <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                            <UserLock className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-surface-500 leading-normal">This person will be the primary point of contact for regulatory matters.</p>
                        </div>
                        </div>
                        <div className="space-y-2">
                            <Input label="Contact Email *" placeholder="contact@yourcompany.com" icon={<Mail className="h-4 w-4" />} />
                            <div className="bg-primary-50 rounded-lg p-3 flex gap-2.5 items-start">
                                <Mail className="h-4 w-4 text-primary-500 mt-0.5 shrink-0" />
                                <p className="text-[10px] text-surface-500 leading-normal">For official communications and invoice notifications.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3 border-b border-surface-100 pb-3">
                    <Smartphone className="h-5 w-5 text-primary-500" />
                    <span className="text-sm font-bold text-primary-500">System Identification</span>
                </div>
                <div className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-surface-900 ml-0.5">Primary Industry *</label>
                        <select className="flex h-11 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 italic text-surface-400">
                            <option>Select Industry</option>
                        </select>
                    </div>

                    <div className="bg-primary-50/30 border border-dashed border-primary-300 rounded-xl p-8 flex flex-col items-center justify-center space-y-4">
                        <p className="text-xs font-medium text-surface-600">Your <span className="text-primary-500 font-bold">Unique Business ID</span> will be generated after submission.</p>
                        <div className="bg-white border border-primary-200 px-10 py-4 rounded-xl">
                            <span className="text-2xl font-bold text-primary-500 font-mono tracking-widest">NG-APP-XXXX-XXXX</span>
                        </div>
                        <p className="text-[10px] text-surface-400 font-medium italic">This ID will be your standard identification within the national e-invoicing system.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function APISetupStep() {
    const [env, setEnv] = useState<"test" | "live">("test");

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
                    <h4 className="text-sm font-bold text-surface-900">Test Environment Credentials</h4>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-surface-500">APP API Key</label>
                    <div className="bg-surface-900 text-white p-4 rounded-xl flex items-center justify-between font-mono text-sm tracking-widest overflow-hidden">
                        <span className="truncate opacity-50">••••••••••••••••••••••••••••••••</span>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm" className="bg-white gap-2 text-primary-500 border-surface-200">
                            <Zap className="h-3.5 w-3.5" /> Generate Key
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white gap-2 text-primary-500 border-surface-200">
                            <Eye className="h-3.5 w-3.5" /> Show Key
                        </Button>
                        <Button variant="outline" size="sm" className="bg-white gap-2 text-primary-500 border-surface-200">
                            <Copy className="h-3.5 w-3.5" /> Copy
                        </Button>
                    </div>
                </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-lg p-8 space-y-6 border border-surface-100">
                <div className="flex items-center gap-3">
                    <Link2 className="h-5 w-5 text-primary-500" />
                    <h4 className="text-sm font-bold text-surface-900">Webhook Endpoint</h4>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <p className="text-xs text-surface-500">Required to receive invoice notifications from NRS</p>
                        <div className="bg-surface-100/50 border border-surface-200 p-4 rounded-xl text-sm text-surface-900/50 font-medium">
                            https://api-sandbox.nexusgate.app/webhook/NG-APP-5678-ACME
                        </div>
                        <div className="flex items-center gap-2 border border-surface-500 w-fit py-1 px-3 rounded-xl bg-[#34C7592B]">
                            <div className="h-3 w-3 rounded-full bg-[#34C759] flex items-center justify-center">
                                <Check className="h-2 w-2 text-white" />
                            </div>
                            <span className="text-xs font-bold text-[#34C759]">Active</span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-surface-900">Custom Webhook URL (Optional)</label>
                        <div className="flex gap-3">
                            <Input placeholder="https://yourdomain.com/webhook" className="bg-white" />
                            <Button className="shrink-0 px-8">Update</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
