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
    label,
    value,
    trend,
    subtext,
    ...props
}: StatCardProps) => {
    return (
        <Card className={cn("p-5 space-y-4", className)} {...props}>
            <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-500">
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
                <div className="text-sm font-medium text-surface-400 mt-1">{label}</div>
                {subtext && (
                    <div className="text-xs text-surface-400 mt-0.5">{subtext}</div>
                )}
            </div>
        </Card>
    );
};

export { Card, StatCard };
