import * as React from "react";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5 flex-1">
                {label && (
                    <label className="text-sm font-medium text-surface-900 ml-0.5 uppercase tracking-wider">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        className={cn(
                            "flex h-11 w-full appearance-none rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50 pr-10",
                            error && "border-danger-500 focus:ring-danger-500/20 focus:border-danger-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
                {error && (
                    <p className="text-xs text-danger-500 mt-1 ml-0.5">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = "Select";

export { Select };
