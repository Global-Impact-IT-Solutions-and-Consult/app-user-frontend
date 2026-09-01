import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { resetPassword } = useAuthStore();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [strength, setStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
        if (password.length < 8 || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            setError("Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.");
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await resetPassword(token, password);
            setDone(true);
        } catch (err) {
            setError((err as ApiError).response?.data?.message || "That reset link is invalid or has expired. Request a new one.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
                <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                    <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                        <img
                            src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                            alt="New Password"
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                        />
                    </div>
                    <div className="flex w-full flex-col justify-center items-start lg:w-7/12 p-8 sm:p-12 lg:p-16 space-y-6">
                        <h1 className="text-3xl font-bold text-primary-500 font-serif">Invalid Reset Link</h1>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                            This password reset link is missing or malformed. Request a new one from the Forgot Password page.
                        </p>
                        <Button className="w-full py-6 text-base" onClick={() => navigate("/forgot-password")}>
                            Request New Link
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="New Password"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col justify-center lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    {done ? (
                        <div className="space-y-6">
                            <div className="h-14 w-14 rounded-full bg-success-50 flex items-center justify-center text-success-500">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-primary-500 font-serif">Password Reset</h1>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                                    Your password has been updated. You can now log in with your new password.
                                </p>
                            </div>
                            <Button className="w-full py-6 text-base" onClick={() => navigate("/login")}>
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-10">
                                <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">New Password</h1>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                                    Please enter your new password below. Ensure it meets the security requirements.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-6">
                                    <div className="relative">
                                        <Input
                                            label="New Password *"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimum 8 characters"
                                            className="pr-10"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-[38px] text-surface-900 hover:text-surface-600"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <div className="space-y-2">
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
                                        <div className="h-1 w-full bg-surface-200 rounded-full overflow-hidden">
                                            <div
                                                className={cn("h-full transition-all duration-300", strengthColors[strength])}
                                                style={{ width: `${(strength / 3) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <Input
                                            label="Confirm New Password *"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Re-enter your password"
                                            className="pr-10"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            className="absolute right-3 top-[38px] text-surface-900 hover:text-surface-600"
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full py-6 text-base" disabled={isLoading}>
                                    {isLoading ? "Resetting..." : "Reset Password"}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
