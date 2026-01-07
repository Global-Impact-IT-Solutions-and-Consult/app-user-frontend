import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="Recovery"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col justify-center lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    <div className="mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="h-10 w-10 border border-surface-400 rounded flex items-center justify-center text-surface-400 hover:text-surface-600 hover:bg-surface-50 transition-all mb-8 cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4 text-surface-900" />
                        </button>
                        <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">Reset Password</h1>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                            A link will be sent to your email address, where you can update with a new password
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Input label="Email Address *" type="email" placeholder="name@yourcompany.com" />
                        <Button className="w-full py-6 text-base" onClick={() => navigate("/reset-password")}>
                            Send Link
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
