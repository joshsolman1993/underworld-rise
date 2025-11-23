import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-dark-lighter border border-white/10 rounded-lg shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="text-xl font-bold font-orbitron text-white">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="p-4 max-h-[70vh] overflow-y-auto">
                        {children}
                    </div>
                    {footer && (
                        <div className="flex justify-end gap-2 p-4 border-t border-white/10 bg-black/20">
                            {footer}
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
