import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Lock, ChevronDown } from "lucide-react";

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await login(formData);
            navigate("/verify-account");
        } catch (err: any) {
            console.log(err)
            // If 429 Account locked, or 401 Invalid credentials
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
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

                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6 flex-1">
                        <Input
                            label="Email Address *"
                            type="email"
                            name="email"
                            placeholder="name@yourcompany.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <div className="space-y-1">
                            <div className="relative">
                                <Input
                                    label="Password *"
                                    type="password"
                                    name="password"
                                    placeholder="************"
                                    className="pr-10"
                                    value={formData.password}
                                    onChange={handleChange}
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

                        <Button className="w-full py-6 text-base" onClick={handleLogin} disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
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
