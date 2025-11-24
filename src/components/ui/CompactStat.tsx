import { LucideIcon } from 'lucide-react'

interface CompactStatProps {
    icon: LucideIcon
    value: number
    color: string
}

export default function CompactStat({ icon: Icon, value, color }: CompactStatProps) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '6px',
                border: `1px solid ${color}33`
            }}
        >
            <Icon size={14} style={{ color, opacity: 0.8 }} />
            <span
                style={{
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    fontFamily: 'var(--font-mono)',
                    color
                }}
            >
                {value}
            </span>
        </div>
    )
}
