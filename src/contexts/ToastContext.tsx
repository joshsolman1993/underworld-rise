import React, { createContext, useContext, useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import Toast from '../components/ui/Toast'

interface ToastMessage {
    id: string
    type: 'success' | 'error' | 'info'
    message: string
    duration?: number
}

interface ToastContextType {
    toast: {
        success: (message: string, duration?: number) => void
        error: (message: string, duration?: number) => void
        info: (message: string, duration?: number) => void
    }
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([])

    const addToast = useCallback((type: 'success' | 'error' | 'info', message: string, duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newToast: ToastMessage = { id, type, message, duration }

        setToasts((prev) => [...prev, newToast])

        // Auto-dismiss
        setTimeout(() => {
            removeToast(id)
        }, duration)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, [])

    const toast = {
        success: (message: string, duration?: number) => addToast('success', message, duration),
        error: (message: string, duration?: number) => addToast('error', message, duration),
        info: (message: string, duration?: number) => addToast('info', message, duration),
    }

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    bottom: 'var(--space-lg)',
                    right: 'var(--space-lg)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-sm)',
                    maxWidth: '400px',
                }}
            >
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            type={toast.type}
                            message={toast.message}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within ToastProvider')
    }
    return context
}
