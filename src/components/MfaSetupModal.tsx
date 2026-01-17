import { useState, useEffect } from "react";
import { X, Copy, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useToast } from "./ui/Toast";

interface MfaSetupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MfaSetupModal = ({ isOpen, onClose }: MfaSetupModalProps) => {
    const { setupMfa, enableMfa } = useAuthStore();
    const { toast } = useToast();

    const [step, setStep] = useState<'loading' | 'scan' | 'verify' | 'success'>('loading');
    const [qrCode, setQrCode] = useState<string>("");
    const [secret, setSecret] = useState<string>("");
    const [entryKey, setEntryKey] = useState<string>("");
    const [otp, setOtp] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            initSetup();
        } else {
            // Reset state on close
            setStep('loading');
            setOtp("");
            setError(null);
        }
    }, [isOpen]);

    const initSetup = async () => {
        setStep('loading');
        setError(null);
        try {
            const data = await setupMfa();
            setQrCode(data.qrCode);
            setSecret(data.secret);
            setEntryKey(data.manualEntryKey);
            setStep('scan');
        } catch (e) {
            setError("Failed to initialize MFA setup. Please try again.");
            toast({ title: "Setup Failed", description: "Could not fetch MFA details.", variant: "error" });
        }
    };

    const handleVerify = async () => {
        if (!otp || otp.length !== 6) return;
        setIsLoading(true);
        setError(null);
        try {
            await enableMfa(otp, secret);
            setStep('success');
            toast({ title: "MFA Enabled", description: "Two-factor authentication is now active.", variant: "success" });
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (e) {
            setError("Invalid verification code. Please try again.");
            toast({ title: "Verification Failed", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied", description: "Secret copied to clipboard", variant: "success" });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                    <h2 className="text-lg font-bold text-surface-900">Setup Two-Factor Authentication</h2>
                    <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {step === 'loading' && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                            <p className="text-sm text-surface-500">Initializing MFA setup...</p>
                        </div>
                    )}

                    {error && step !== 'loading' && (
                        <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-sm mb-4 flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {step === 'scan' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-surface-600">
                                    Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                                </p>
                            </div>

                            <div className="flex justify-center p-4 bg-white border border-surface-200 rounded-lg">
                                {qrCode ? (
                                    <img src={qrCode} alt="MFA QR Code" className="h-48 w-48" />
                                ) : (
                                    <div className="h-48 w-48 bg-surface-100 animate-pulse rounded" />
                                )}
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-center text-surface-400 uppercase font-bold tracking-wider">
                                    Or enter manual key
                                </p>
                                <div className="flex items-center gap-2 bg-surface-50 p-3 rounded-lg border border-surface-200">
                                    <code className="flex-1 text-center font-mono text-sm text-surface-700 break-all">
                                        {entryKey}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(entryKey)}
                                        className="p-2 hover:bg-surface-200 rounded-md transition-colors"
                                        title="Copy to clipboard"
                                    >
                                        <Copy className="h-4 w-4 text-surface-500" />
                                    </button>
                                </div>
                            </div>

                            <Button className="w-full" onClick={() => setStep('verify')}>
                                Continue
                            </Button>
                        </div>
                    )}

                    {step === 'verify' && (
                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <p className="text-sm text-surface-600">
                                    Enter the 6-digit code from your authenticator app to verify setup.
                                </p>
                            </div>

                            <div className="py-4">
                                <Input
                                    label="Verification Code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                                    placeholder="000 000"
                                    className="text-center text-2xl tracking-widest font-mono"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1" onClick={() => setStep('scan')}>
                                    Back
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={handleVerify}
                                    disabled={otp.length !== 6 || isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Enable MFA'}
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col items-center justify-center py-8 space-y-4 text-center">
                            <div className="h-16 w-16 bg-success-50 text-success-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-surface-900">MFA Enabled!</h3>
                                <p className="text-surface-500 text-sm mt-1">
                                    Your account is now secured with two-factor authentication.
                                </p>
                            </div>
                            <Button className="w-full mt-4" onClick={onClose}>
                                Done
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
