import { X, Calendar, LayoutGrid } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../lib/utils";

interface TimelineSettingsProps {
    isOpen: boolean;
    onClose: () => void;
    activePeriodId: string;
    onPeriodChange: (id: string) => void;
}

const periods = [
    {
        id: "7days",
        label: "Last 7 Days",
        subtext: "View weekly trends",
        dates: "Nov 3 - Nov 9, 2025",
    },
    {
        id: "30days",
        label: "Last 30 Days",
        subtext: "View monthly overview",
        dates: "Oct 10 - Nov 9, 2025"
    },
    {
        id: "3months",
        label: "Last 3 Months",
        subtext: "View quarterly performance",
        dates: "Aug 10 - Nov 9, 2025"
    },
    {
        id: "6months",
        label: "Last 6 Months",
        subtext: "View half-year trends",
        dates: "May 10 - Nov 9, 2025"
    },
    {
        id: "12months",
        label: "Last 12 Months",
        subtext: "View annual performance",
        dates: "Nov 10, 2024 - Nov 9, 2025"
    }
];

export const TimelineSettings = ({ isOpen, onClose, activePeriodId, onPeriodChange }: TimelineSettingsProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-surface-100">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-primary-500" />
                        <h2 className="text-xl font-bold text-primary-700">Timeline Settings</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-900">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                    {/* Period selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-600">Select TimeLine Period</h3>
                        <div className="space-y-3">
                            {periods.map((period) => (
                                <button
                                    key={period.id}
                                    onClick={() => onPeriodChange(period.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                                        activePeriodId === period.id
                                            ? "border-primary-500 bg-primary-50/50 shadow-sm"
                                            : "border-surface-200 bg-white hover:border-primary-200"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "h-10 w-10 rounded-lg flex items-center justify-center",
                                            activePeriodId === period.id ? "bg-primary-500 text-white" : "bg-primary-100 text-primary-500"
                                        )}>
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-surface-900">{period.label}</p>
                                            <p className="text-xs text-surface-900/70">{period.subtext}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-surface-900/70 font-medium">{period.dates}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Range */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-surface-600">Custom Date Range</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-surface-900">Start Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="10/10/2025"
                                        className="w-full h-11 px-4 pr-10 rounded-xl border border-surface-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-surface-900">End Date</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        defaultValue="10/10/2025"
                                        className="w-full h-11 px-4 pr-10 rounded-xl border border-surface-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-3 p-6 border-t border-surface-100 bg-surface-50/30">
                    <Button variant="outline" className="w-[120px]" onClick={onClose}>Cancel</Button>
                    <Button className="w-[120px]" onClick={onClose}>Apply</Button>
                </div>
            </div>
        </div>
    );
};
