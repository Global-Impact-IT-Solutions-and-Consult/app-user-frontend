import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card"; // Added Card import
import { ShieldCheck, LifeBuoy, FileText } from "lucide-react";

export default function Signup() {
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        navigate("/onboarding");
    };

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-6">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                {/* Left Side - Image/Branding */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="Invoicing backdrop"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    <div className="mx-auto w-full max-w-md space-y-8">
                        <div className="space-y-2 text-center lg:text-left">
                            <h1 className="text-3xl font-bold tracking-tight text-primary-500">Get Started</h1>
                            <p className="text-sm text-surface-500 leading-relaxed font-medium">
                                Enter your business email address. We'll send you a secure link to create your account and begin the onboarding process.
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-6">
                            <Input
                                label="Business Email Address *"
                                placeholder="name@yourcomapny.com"
                                type="email"
                                required
                            />
                            <Input
                                label="Tax Identification Number (TIN) *"
                                placeholder="e.g., 12345678-001"
                                required
                            />

                            <Button type="submit" className="w-full text-base h-12">
                                Send Secure Link
                            </Button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-surface-200" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white px-4 text-surface-900 font-medium">Already have an account?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link to="/login" className="text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors cursor-pointer">
                                Sign in here <span className="text-surface-900 font-normal">to access your dashboard</span>
                            </Link>
                        </div>

                        <footer className="pt-8">
                            <div className="flex flex-wrap justify-center gap-4 text-[10px] text-surface-900 font-bold uppercase tracking-wider">
                                <a href="#" className="flex items-center gap-1.5 hover:text-surface-900 transition-colors cursor">
                                    <ShieldCheck className="h-3.5 w-3.5" /> Privacy Policy
                                </a>
                                <a href="#" className="flex items-center gap-1.5 hover:text-surface-900 transition-colors">
                                    <FileText className="h-3.5 w-3.5" /> Terms of Services
                                </a>
                                <a href="#" className="flex items-center gap-1.5 hover:text-surface-900 transition-colors">
                                    <LifeBuoy className="h-3.5 w-3.5" /> Support
                                </a>
                            </div>
                        </footer>
                    </div>
                </div>
            </Card>
        </div>
    );
}
