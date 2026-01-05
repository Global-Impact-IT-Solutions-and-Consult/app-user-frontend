import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "primary" | "success" | "warning" | "danger" | "gray";
    size?: "sm" | "md";
    icon?: React.ReactNode;
}

const Badge = ({
    className,
    variant = "gray",
    size = "md",
    icon,
    children,
    ...props
}: BadgeProps) => {
    const variants = {
        primary: "bg-primary-50 text-primary-700",
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-100 text-warning-800",
        danger: "bg-danger-50 text-danger-700",
        gray: "bg-surface-100 text-surface-900",
    };

    const sizes = {
        sm: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-md font-medium transition-colors",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </div>
    );
};

export { Badge };
