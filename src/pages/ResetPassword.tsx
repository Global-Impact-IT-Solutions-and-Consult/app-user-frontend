import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { cn } from "../lib/utils";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">New Password</h1>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                            Please enter your new password below. Ensure it meets the security requirements.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-6">
                            <div className="relative">
                                <Input
                                    label="New Password *"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 12 character"
                                    className="pr-10"
                                    value={password}
                                    onChange={handlePasswordChange}
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

                        <Button className="w-full py-6 text-base" onClick={() => navigate("/login")}>
                            Reset Password
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
