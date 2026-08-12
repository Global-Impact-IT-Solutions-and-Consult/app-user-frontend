import type { ElementType } from "react";
import { BookOpen, Calculator, Landmark } from "lucide-react";

export interface IntegrationService {
    slug: string;
    name: string;
    description: string;
    icon: ElementType;
    comingSoon?: boolean;
}

export const INTEGRATION_SERVICES: IntegrationService[] = [
    {
        slug: "zoho-books",
        name: "Zoho Books",
        description: "Sync invoices and payments with Zoho Books",
        icon: BookOpen,
    },
    {
        slug: "quickbooks",
        name: "QuickBooks",
        description: "Sync invoices from QuickBooks Online",
        icon: Calculator,
    },
    {
        slug: "xero",
        name: "Xero",
        description: "Sync invoices from Xero",
        icon: Landmark,
    },
];
