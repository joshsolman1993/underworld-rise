import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ResourceHexagonProps {
    value: number
    max: number
    label: string
    icon: LucideIcon
    color: string
    className?: string
}

export default function ResourceHexagon({
    value,
    max,
    label,
    icon: Icon,
    color,
    className = ''
}: ResourceHexagonProps) {
    const [prevValue, setPrevValue] = useState(value)
    const [isRegenerating, setIsRegenerating] = useState(false)

    const percentage = (value / max) * 100
    const circumference = 2 * Math.PI * 45 // radius = 45
    const strokeDashoffset = circumference - (percentage / 100) * circumference

    useEffect(() => {
        if (value > prevValue) {
            setIsRegenerating(true)
            const timeout = setTimeout(() => setIsRegenerating(false), 1000)
            return () => clearTimeout(timeout)
        }
        setPrevValue(value)
    }, [value, prevValue])

    return (
        <div className={`flex flex-col items-center gap-2 ${className}`}>
            {/* Hexagon Container */}
            <motion.div
                className="relative"
                animate={isRegenerating ? {
                    scale: [1, 1.05, 1],
                    filter: [
                        `drop-shadow(0 0 8px ${color}40)`,
                        `drop-shadow(0 0 16px ${color}80)`,
                        `drop-shadow(0 0 8px ${color}40)`
                    ]
                } : {}}
                transition={{
                    duration: 0.6,
                    repeat: isRegenerating ? Infinity : 0,
                    ease: "easeInOut"
                }}
            >
                {/* SVG Radial Progress */}
                <svg
                    width="100"
                    height="100"
                    viewBox="0 0 100 100"
                    className="transform -rotate-90"
                >
                    {/* Background Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="rgba(20, 20, 25, 0.6)"
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="2"
                    />

                    {/* Progress Circle */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        style={{
                            filter: `drop-shadow(0 0 4px ${color})`
                        }}
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Icon size={24} style={{ color }} />
                    <span
                        className="text-sm font-bold font-mono mt-1"
                        style={{ color }}
                    >
                        {value}
                    </span>
                </div>
            </motion.div>

            {/* Label - Hidden on mobile */}
            <div className="hidden md:block text-xs text-muted uppercase tracking-wide font-medium">
                {label}
            </div>
        </div>
    )
}
