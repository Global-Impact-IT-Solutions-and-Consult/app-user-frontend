import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function VerifyAccount() {
    const navigate = useNavigate();
    const [timer, setTimer] = useState(179); // 02:59 in seconds

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

                    <div className="space-y-8 w-full">
                        {/* OTP Input - Mockup */}
                        <div className="flex justify-between gap-3">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <input
                                    key={i}
                                    type="text"
                                    maxLength={1}
                                    className="w-12 h-14 border border-[#E2E8F0] rounded-lg text-center text-xl font-bold focus:border-primary-500 focus:ring-1 focus:ring-primary-500 bg-[#F8F9FA] outline-none transition-all"
                                />
                            ))}
                        </div>

                        <Button className="w-full py-6 text-base" onClick={() => navigate("/dashboard")}>
                            Login
                        </Button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-100"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <div className="bg-white px-6 flex items-center gap-2">
                                    <span className="text-surface-400 font-medium">Resend Security code</span>
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
