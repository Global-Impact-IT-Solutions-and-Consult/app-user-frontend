import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const { forgotPassword } = useAuthStore();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setError(null);
        try {
            await forgotPassword(email);
            // Backend always responds the same way whether or not the email
            // exists, on purpose - so this success state shows regardless.
            setSent(true);
        } catch {
            setError("Something went wrong sending the reset link. Please try again.");
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
                        alt="Recovery"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                {/* Right Side - Form */}
                <div className="flex w-full flex-col justify-center lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    {sent ? (
                        <div className="space-y-6">
                            <div className="h-14 w-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-500">
                                <MailCheck className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-primary-500 font-serif">Check your email</h1>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                                    If an account exists for <span className="font-semibold text-surface-900">{email}</span>, we've sent a link to reset your password. It expires in 1 hour.
                                </p>
                            </div>
                            <Button variant="outline" className="w-full py-6 text-base" onClick={() => navigate("/login")}>
                                Back to Login
                            </Button>
                        </div>
                    ) : (
                        <>
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

                            {error && (
                                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Input
                                    label="Email Address *"
                                    type="email"
                                    placeholder="name@yourcompany.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Button type="submit" className="w-full py-6 text-base" disabled={isLoading}>
                                    {isLoading ? "Sending..." : "Send Link"}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
