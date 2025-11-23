import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import '../../styles/components.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: <CheckCircle size={20} color="var(--color-success)" />,
    error: <AlertCircle size={20} color="var(--color-danger)" />,
    warning: <AlertTriangle size={20} color="var(--color-warning)" />,
    info: <Info size={20} color="var(--color-info)" />
};

export const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 4000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className={`toast ${type}`}
        >
            {/* Scanline effect */}
            <div className="toast-scanline" />

            <div className="toast-content">
                <div style={{ flexShrink: 0, marginTop: '2px' }}>
                    {icons[type]}
                </div>

                <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px', margin: 0 }}>
                        {type}
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: 1.5, margin: 0 }}>
                        {message}
                    </p>
                </div>

                <button
                    onClick={() => onClose(id)}
                    className="toast-close"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Progress Bar */}
            <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="toast-progress"
                style={{
                    background: type === 'success' ? 'var(--color-success)' :
                        type === 'error' ? 'var(--color-danger)' :
                            type === 'warning' ? 'var(--color-warning)' :
                                'var(--color-info)'
                }}
            />
        </motion.div>
    );
};

export const ToastContainer: React.FC<{ toasts: ToastProps[], removeToast: (id: string) => void }> = ({ toasts, removeToast }) => {
    return (
        <div className="toast-container">
            <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <Toast key={toast.id} {...toast} onClose={removeToast} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Toast;
