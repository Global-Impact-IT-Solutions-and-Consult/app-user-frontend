import * as React from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./ui/Button";
import { useCompanyStore } from "../store/companyStore";
import { isOnboardingComplete, getIncompleteSteps, getStepLabel, STEP_SETTINGS_TAB } from "../lib/onboarding";

function readDismissed(key: string): boolean {
    try {
        return sessionStorage.getItem(key) === "true";
    } catch {
        return false;
    }
}

function writeDismissed(key: string) {
    try {
        sessionStorage.setItem(key, "true");
    } catch {
        // sessionStorage can throw in locked-down contexts (private browsing, etc.) - just skip persisting the dismissal.
    }
}

export function OnboardingBanner() {
    const navigate = useNavigate();
    const { currentCompany } = useCompanyStore();
    const dismissKey = currentCompany?.id ? `onboarding-banner-dismissed:${currentCompany.id}` : null;
    const [dismissed, setDismissed] = React.useState(() => (dismissKey ? readDismissed(dismissKey) : false));

    React.useEffect(() => {
        setDismissed(dismissKey ? readDismissed(dismissKey) : false);
    }, [dismissKey]);

    if (!currentCompany || dismissed || isOnboardingComplete(currentCompany.onboardingSteps)) {
        return null;
    }

    const incompleteSteps = getIncompleteSteps(currentCompany.onboardingSteps);
    const nextStep = incompleteSteps[0];

    const handleFinishSetup = () => {
        navigate("/dashboard/settings", { state: { tab: STEP_SETTINGS_TAB[nextStep] } });
    };

    const handleDismiss = () => {
        if (dismissKey) writeDismissed(dismissKey);
        setDismissed(true);
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-warning-200 bg-warning-50 px-5 py-4">
            <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-warning-100 flex items-center justify-center text-warning-600 shrink-0">
                    <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-bold text-surface-900">Your account setup isn't finished</p>
                    <p className="text-xs text-surface-900/70">
                        Still needed: {incompleteSteps.map(getStepLabel).join(" · ")}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" className="font-bold" onClick={handleFinishSetup}>
                    Finish Setup
                </Button>
                <button
                    onClick={handleDismiss}
                    className="p-2 hover:bg-warning-100 rounded-lg text-surface-900/50 hover:text-surface-900 transition-colors"
                    aria-label="Dismiss"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
