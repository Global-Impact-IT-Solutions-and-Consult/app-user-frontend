import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { ShieldCheck, Lock, ChevronDown } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="Dashboard mockup"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">Login</h1>
                        <p className="text-surface-500 text-sm leading-relaxed">
                            You will be required to verify your identity using your configured multi factor authentication (MFA) method.
                        </p>
                    </div>

                    <div className="space-y-6 flex-1">
                        <Input label="Email Address *" type="email" placeholder="name@yourcompany.com" />
                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    label="Password *"
                                    type="password"
                                    placeholder="************"
                                    className="pr-10"
                                />
                                <button className="absolute right-3 top-[38px] text-surface-900 hover:text-surface-600">
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        </div>

                        <Button className="w-full py-6 text-base" onClick={() => navigate("/verify-account")}>
                            Login
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-surface-100"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-surface-900 font-medium">Don't have an account?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-surface-500">
                                <button
                                    onClick={() => navigate("/signup")}
                                    className="font-bold text-primary-500 hover:text-primary-600 transition-colors cursor-pointer"
                                >
                                    Sign up here
                                </button> to access your dashboard
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-center gap-6 text-[10px] font-bold text-surface-900 uppercase tracking-widest">
                        <a href="#" className="flex items-center gap-1.5 hover:text-surface-600">
                            <Lock className="h-3 w-3" />
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-surface-600">Terms of Services</a>
                        <a href="#" className="hover:text-surface-600">Support</a>
                    </div>
                </div>
            </Card>
        </div>
    );
}
