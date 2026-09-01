import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function AcceptInvite() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const { acceptInvite } = useAuthStore();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setIsLoading(true);
        setError(null);
        try {
            const result = await acceptInvite(token, password || undefined, firstName || undefined, lastName || undefined);
            setCompanyName(result.companyName || "the team");
        } catch (err) {
            setError((err as ApiError).response?.data?.message || "That invite is invalid or has expired.");
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
                            alt="Team invite"
                            className="absolute inset-0 h-full w-full object-cover opacity-60"
                        />
                    </div>
                    <div className="flex w-full flex-col justify-center items-start lg:w-7/12 p-8 sm:p-12 lg:p-16 space-y-6">
                        <h1 className="text-3xl font-bold text-primary-500 font-serif">Invalid Invite Link</h1>
                        <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                            This invite link is missing or malformed. Ask whoever invited you to send a new one.
                        </p>
                        <Button className="w-full py-6 text-base" onClick={() => navigate("/login")}>
                            Back to Login
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <Card className="max-w-4xl w-full overflow-hidden border-none shadow-2xl flex min-h-[600px] bg-white">
                <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-surface-900">
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-900/80 to-transparent" />
                    <img
                        src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000"
                        alt="Team invite"
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                    />
                </div>

                <div className="flex w-full flex-col justify-center lg:w-7/12 p-8 sm:p-12 lg:p-16">
                    {companyName ? (
                        <div className="space-y-6">
                            <div className="h-14 w-14 rounded-full bg-success-50 flex items-center justify-center text-success-500">
                                <CheckCircle2 className="h-7 w-7" />
                            </div>
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold text-primary-500 font-serif">You're in</h1>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                                    You've joined <span className="font-semibold text-surface-900">{companyName}</span>. Log in to get started.
                                </p>
                            </div>
                            <Button className="w-full py-6 text-base" onClick={() => navigate("/login")}>
                                Go to Login
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold text-primary-500 mb-2 font-serif">Join the Team</h1>
                                <p className="text-surface-500 text-sm leading-relaxed max-w-sm">
                                    You've been invited to join a company. If you already have an account with this email, just confirm below - otherwise set a password to create one.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    <Input
                                        label="Last Name"
                                        placeholder="Doe"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Only needed if you don't have an account yet"
                                        className="pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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

                                <Button type="submit" className="w-full py-6 text-base" disabled={isLoading}>
                                    {isLoading ? "Joining..." : "Accept Invite"}
                                </Button>
                            </form>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}
