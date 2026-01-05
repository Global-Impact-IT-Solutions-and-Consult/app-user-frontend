import * as React from "react";
import { cn } from "../../lib/utils";

export interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onToggle"> {
    onToggleChange?: (checked: boolean) => void;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
    ({ className, checked, onChange, onToggleChange, ...props }, ref) => {
        const [isChecked, setIsChecked] = React.useState(checked || false);

        React.useEffect(() => {
            if (checked !== undefined) {
                setIsChecked(checked);
            }
        }, [checked]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const targetChecked = e.target.checked;
            setIsChecked(targetChecked);
            onChange?.(e);
            onToggleChange?.(targetChecked);
        };

        return (
            <label className={cn("relative inline-flex cursor-pointer items-center", className)}>
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isChecked}
                    onChange={handleChange}
                    ref={ref}
                    {...props}
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-300 transition-all after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-surface-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-success-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20"></div>
            </label>
        );
    }
);

Toggle.displayName = "Toggle";

export { Toggle };
