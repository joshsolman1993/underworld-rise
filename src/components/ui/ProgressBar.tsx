import React from 'react';
import '../../styles/components.css'

interface ProgressBarProps {
    value: number
    max: number
    label?: string
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    showLabel?: boolean
    height?: string
    className?: string
}

export default function ProgressBar({
    value,
    max,
    label,
    color = 'primary',
    showLabel = true,
    height = '6px',
    className = ''
}: ProgressBarProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const colorMap = {
        primary: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))',
        success: 'linear-gradient(90deg, var(--color-success), #00cc6a)',
        warning: 'linear-gradient(90deg, var(--color-warning), #ff8800)',
        danger: 'linear-gradient(90deg, var(--color-danger), #cc0033)',
        info: 'linear-gradient(90deg, var(--color-info), #3b82f6)',
    }

    return (
        <div className={`stat-bar ${className}`} style={{ height }}>
            <div
                className="stat-bar-fill"
                style={{
                    width: `${percentage}%`,
                    background: colorMap[color],
                }}
            />
            {showLabel && (
                <div className="stat-bar-label">
                    {label || `${value} / ${max}`}
                </div>
            )}
        </div>
    )
}
