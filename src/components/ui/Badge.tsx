import { ReactNode, CSSProperties } from 'react'
import '../../styles/components.css'

interface BadgeProps {
    children: ReactNode
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
    style?: CSSProperties
    className?: string
}

export default function Badge({ children, variant = 'default', style, className = '' }: BadgeProps) {
    return (
        <span className={`badge ${variant !== 'default' ? variant : ''} ${className}`.trim()} style={style}>
            {children}
        </span>
    )
}
