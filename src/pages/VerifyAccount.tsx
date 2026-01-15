import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const { verifyMfa, resendOtp } = useAuthStore();
    const [timer, setTimer] = useState(179); // 02:59 in seconds
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter a valid 6-digit code");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await verifyMfa(code);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Verification failed. Invalid code.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await resendOtp();
            setTimer(179);
            setError(null);
            // Optionally show success toast
        } catch (err: any) {
            setError("Failed to resend OTP.");
        }
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="Security"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col justify-center items-center lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    <div className="mb-10 w-full">
                        <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">Verify Your Account</h1>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-sm mx-auto">
                            We’ve sent you a one time code to login. Please check your email and enter the code below.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 w-full p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-8 w-full">
                        {/* OTP Input */}
                        <div className="flex justify-between gap-3">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`otp-${i}`}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    className="w-12 h-14 border border-[#E2E8F0] rounded-lg text-center text-xl font-bold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-[#F8F9FA] outline-none transition-all"
                                />
                            ))}
                        </div>

                        <Button className="w-full py-6 text-base" onClick={handleVerify} disabled={isLoading}>
                            {isLoading ? "Verifying..." : "Verify"}
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <div className="bg-white px-6 flex items-center gap-2">
                                    <button onClick={handleResend} className="text-surface-400 font-medium hover:text-surface-600 transition-colors">Resend Security code</button>
                                    <span className="text-surface-900 font-bold tabular-nums">{formatTime(timer)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
