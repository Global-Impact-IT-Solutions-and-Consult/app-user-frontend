import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useToast } from "./ui/Toast";

interface DisableMfaModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const DisableMfaModal = ({ isOpen, onClose }: DisableMfaModalProps) => {
    const { disableMfa } = useAuthStore();
    const { toast } = useToast();

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setOtp("");
            setError(null);
        }
    }, [isOpen]);

    const handleDisable = async () => {
        if (!otp || otp.length !== 6) return;
        setIsLoading(true);
        setError(null);
        try {
            await disableMfa(otp);
            toast({ title: "MFA Disabled", description: "Two-factor authentication has been turned off.", variant: "default" });
            onClose();
        } catch {
            setError("Failed to disable MFA. Please try again.");
            toast({ title: "Failed to Disable", description: "Could not verify code.", variant: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-100">
                    <h2 className="text-lg font-bold text-surface-900 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-surface-500" />
                        Disable Two-Factor Auth
                    </h2>
                    <button onClick={onClose} className="text-surface-400 hover:text-surface-600 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm text-surface-600">
                            To disable Two-Factor Authentication, please enter the code from your authenticator app to confirm it's you.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-danger-50 text-danger-600 p-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="py-2">
                        <Input
                            label="Verification Code"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                            placeholder="000 000"
                            className="text-center text-2xl tracking-widest font-mono"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            className="flex-1"
                            onClick={handleDisable}
                            disabled={otp.length !== 6 || isLoading}
                        >
                            {isLoading ? 'Disabling...' : 'Disable MFA'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
