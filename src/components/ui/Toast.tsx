/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export type ToastVariant = 'default' | 'success' | 'error' | 'warning';

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const toast = useCallback(({
        title,
        description,
        variant = 'default',
        duration = 5000
    }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = { id, title, description, variant, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                dismiss(id);
            }, duration);
        }
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) => {
    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-[380px] pointer-events-none p-4 sm:p-0">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={() => onDismiss(t.id)} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) => {
    const icons = {
        default: <Info className="h-5 w-5 text-primary-500" />,
        success: <CheckCircle className="h-5 w-5 text-success-500" />,
        error: <AlertCircle className="h-5 w-5 text-danger-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-warning-500" />
    };

    const variants = {
        default: "bg-white border-primary-100",
        success: "bg-white border-success-100",
        error: "bg-white border-danger-100",
        warning: "bg-white border-warning-100"
    };

    return (
        <div className={cn(
            "pointer-events-auto flex items-start gap-4 p-4 rounded-xl border shadow-lg shadow-surface-900/5 animate-in slide-in-from-right-full duration-300",
            variants[toast.variant || 'default']
        )}>
            <div className="shrink-0 pt-0.5">
                {icons[toast.variant || 'default']}
            </div>
            <div className="flex-1 space-y-0.5">
                {toast.title && <h3 className="font-bold text-sm text-surface-900">{toast.title}</h3>}
                {toast.description && <p className="text-xs text-surface-500 font-medium leading-relaxed">{toast.description}</p>}
            </div>
            <button
                onClick={onDismiss}
                className="shrink-0 text-surface-400 hover:text-surface-900 transition-colors -mt-1 -mr-1 p-1 rounded-lg hover:bg-surface-50"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
