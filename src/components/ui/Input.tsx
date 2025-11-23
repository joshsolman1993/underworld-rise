import { InputHTMLAttributes } from 'react'
import '../../styles/components.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-sm">
            {label && (
                <label className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                    {label}
                </label>
            )}
            <input className={`input-field ${className}`.trim()} {...props} />
            {error && (
                <span className="text-danger" style={{ fontSize: 'var(--font-size-xs)' }}>
                    {error}
                </span>
            )}
        </div>
    )
}
