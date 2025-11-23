import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface FloatingText {
    id: string
    x: number
    y: number
    text: string
    color: string
}

interface FloatingTextContextType {
    showFloatingText: (x: number, y: number, text: string, color: string) => void
}

const FloatingTextContext = createContext<FloatingTextContextType | undefined>(undefined)

export function FloatingTextProvider({ children }: { children: React.ReactNode }) {
    const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])

    const showFloatingText = useCallback((x: number, y: number, text: string, color: string) => {
        const id = `${Date.now()}-${Math.random()}`
        const newText: FloatingText = { id, x, y, text, color }

        setFloatingTexts(prev => [...prev, newText])

        // Auto-remove after animation completes
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(t => t.id !== id))
        }, 2000)
    }, [])

    return (
        <FloatingTextContext.Provider value={{ showFloatingText }}>
            {children}
            {createPortal(
                <AnimatePresence>
                    {floatingTexts.map(({ id, x, y, text, color }) => (
                        <motion.div
                            key={id}
                            initial={{
                                x: x - 50,
                                y: y - 20,
                                opacity: 1,
                                scale: 1
                            }}
                            animate={{
                                y: y - 100,
                                opacity: 0,
                                scale: 1.2
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1.5,
                                ease: [0.22, 1, 0.36, 1]
                            }}
                            style={{
                                position: 'fixed',
                                pointerEvents: 'none',
                                zIndex: 9999,
                                fontSize: '24px',
                                fontWeight: 'bold',
                                fontFamily: 'var(--font-display)',
                                color: color,
                                textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
                                userSelect: 'none'
                            }}
                        >
                            {text}
                        </motion.div>
                    ))}
                </AnimatePresence>,
                document.body
            )}
        </FloatingTextContext.Provider>
    )
}

export function useFloatingText() {
    const context = useContext(FloatingTextContext)
    if (!context) {
        throw new Error('useFloatingText must be used within FloatingTextProvider')
    }
    return context
}
