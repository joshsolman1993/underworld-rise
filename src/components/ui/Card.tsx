import { ReactNode, CSSProperties } from 'react'
import '../../styles/components.css'

interface CardProps {
    children: ReactNode
    variant?: 'glass' | 'elevated'
    className?: string
    style?: CSSProperties
    onClick?: () => void
}

export default function Card({ children, variant = 'glass', className = '', style, onClick }: CardProps) {
    const baseClass = variant === 'glass' ? 'glass-panel' : 'card-elevated'

    return (
        <div className={`${baseClass} ${className}`.trim()} style={style} onClick={onClick}>
            {children}
        </div>
    )
}
