// Canonical onboarding wizard steps, in order. Names match what's sent to
// PUT /companies/:id/onboarding/:step. Not used to gate routing - only to
// power the Dashboard's "finish setup" banner.
export const ONBOARDING_STEPS = ["company_info", "security", "api_setup"] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

const STEP_LABELS: Record<OnboardingStep, string> = {
    company_info: "Company profile",
    security: "Two-factor authentication",
    api_setup: "API & webhook access",
};

// Where the "Finish Setup" banner button should send the user for each step.
export const STEP_SETTINGS_TAB: Record<OnboardingStep, "general" | "security" | "api"> = {
    company_info: "general",
    security: "security",
    api_setup: "api",
};

export function isOnboardingComplete(steps: Record<string, boolean> | null | undefined): boolean {
    if (!steps) return false;
    return ONBOARDING_STEPS.every((step) => steps[step] === true);
}

export function getIncompleteSteps(steps: Record<string, boolean> | null | undefined): OnboardingStep[] {
    return ONBOARDING_STEPS.filter((step) => !steps || steps[step] !== true);
}

export function getStepLabel(step: OnboardingStep): string {
    return STEP_LABELS[step];
}

// API setup only counts as done once both a key and a webhook exist -
// the onboarding step 3 UI never required either before "Go to Dashboard",
// so this has to be checked explicitly wherever either action can happen.
export function isApiSetupComplete(hasApiKey: boolean, hasWebhook: boolean): boolean {
    return hasApiKey && hasWebhook;
}
