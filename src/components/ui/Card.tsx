import * as React from "react";
import { cn } from "../../lib/utils";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = ({ className, children, ...props }: CardProps) => {
    return (
        <div
            className={cn(
                "rounded-xl border border-surface-300 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export interface StatCardProps extends CardProps {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: string | number;
    trend?: {
        value: string;
        isUp: boolean;
    };
    subtext?: string;
}

const StatCard = ({
    className,
    icon,
    iconBg,
    label,
    value,
    trend,
    subtext,
    ...props
}: StatCardProps) => {
    return (
        <Card className={cn("p-5 space-y-4", className)} {...props}>
            <div className="flex items-start justify-between">
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-md", iconBg)}>
                    {icon}
                </div>
                {trend && (
                    <div
                        className={cn(
                            "flex items-center text-xs font-bold",
                            trend.isUp ? "text-success-600" : "text-danger-600"
                        )}
                    >
                        {trend.isUp ? "↑" : "↓"} {trend.value}
                    </div>
                )}
            </div>
            <div>
                <div className="text-2xl font-bold text-surface-900 tracking-tight">
                    {value}
                </div>
                <div className="text-sm font-medium text-surface-900/70 mt-1">{label}</div>
                {subtext && (
                    <div className="text-xs text-surface-900/70 mt-0.5">{subtext}</div>
                )}
            </div>
        </Card>
    );
};

export { Card, StatCard };
