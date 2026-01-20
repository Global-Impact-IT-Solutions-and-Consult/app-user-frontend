import { X, AlertTriangle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "default";
}

export const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger"
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 p-8 space-y-6">
                <button onClick={onClose} className="absolute right-4 top-4 p-2 hover:bg-surface-50 rounded-lg transition-colors text-surface-400 hover:text-surface-900">
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-2 ${variant === 'danger' ? 'bg-danger-50 text-danger-500' : 'bg-warning-50 text-warning-500'}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h2 className="text-xl font-bold text-surface-900 font-serif">{title}</h2>
                    <p className="text-sm text-surface-500">{description}</p>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 bg-surface-100 border-transparent hover:bg-surface-200 text-surface-900 font-bold h-11"
                        onClick={onClose}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        className={`flex-1 font-bold h-11 ${variant === 'danger' ? 'shadow-lg shadow-danger-500/20' : ''}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};
