import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../components/ui/Toast";

// Lands here after GET /auth/google/callback redirects the browser back
// (?google=ok&requiresMfa=...&tempToken=...&message=... on success,
// ?google=error&message=... on failure). Google sign-in always continues
// through the same OTP step as email/password login.
export default function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { completeGoogleLogin } = useAuthStore();
    const handled = React.useRef(false);

    React.useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const status = searchParams.get("google");
        const tempToken = searchParams.get("tempToken");

        if (status === "ok" && tempToken) {
            completeGoogleLogin(tempToken, searchParams.get("requiresMfa") === "true");
            navigate("/verify-account", { replace: true });
        } else {
            toast({
                title: "Couldn't sign in with Google",
                description: searchParams.get("message") || "Something went wrong finishing Google sign-in.",
                variant: "error",
            });
            navigate("/login", { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
            <p className="text-sm text-surface-500">Finishing sign-in…</p>
        </div>
    );
}
