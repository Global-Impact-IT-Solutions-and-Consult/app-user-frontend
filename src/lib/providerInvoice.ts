// Shared helpers for pulling common fields out of the three different
// raw provider invoice/job payload shapes (Zoho snake_case, QuickBooks
// and Xero PascalCase). Used by both the Invoices list and the provider
// invoice detail page so the "guess the field" logic lives in one place.

export type ProviderSource = "zoho-books" | "quickbooks" | "xero";

export function getString(payload: Record<string, unknown> | null | undefined, keys: string[]) {
    for (const key of keys) {
        const value = payload?.[key];
        if (typeof value === "string" && value.trim()) return value;
        if (typeof value === "number") return String(value);
        if (value && typeof value === "object") {
            const nested = value as Record<string, unknown>;
            for (const nestedKey of ["name", "Name", "value", "Value"]) {
                const nestedValue = nested[nestedKey];
                if (typeof nestedValue === "string" && nestedValue.trim()) return nestedValue;
            }
        }
    }
    return "";
}

export function getNumber(payload: Record<string, unknown> | null | undefined, keys: string[]) {
    for (const key of keys) {
        const value = payload?.[key];
        if (typeof value === "number") return value;
        if (typeof value === "string" && value.trim() && !Number.isNaN(Number(value))) return Number(value);
    }
    return null;
}

export function sourceName(source: ProviderSource) {
    if (source === "zoho-books") return "Zoho Books";
    if (source === "quickbooks") return "QuickBooks";
    if (source === "xero") return "Xero";
    return "Unknown";
}

// Raw line-items array as returned by each provider's invoice payload.
export function getLineItems(payload: Record<string, unknown> | null | undefined, source: ProviderSource): Record<string, unknown>[] {
    if (!payload) return [];
    const key = source === "zoho-books" ? "line_items" : source === "quickbooks" ? "Line" : "LineItems";
    const value = payload[key];
    return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}
