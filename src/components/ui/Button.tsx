import React, { useState } from 'react';
import { motion } from 'framer-motion';
import '../../styles/components.css';


interface RippleType {
    x: number
    y: number
    id: number
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
    {
        children,
        className = '',
        variant = 'primary',
        size = 'md',
        isLoading = false,
        leftIcon,
        rightIcon,
        disabled,
        onClick,
        ...props
    },
    ref
) => {
    const [ripples, setRipples] = useState<RippleType[]>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled || isLoading) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const newRipple = { x, y, id: Date.now() }
        setRipples(prev => [...prev, newRipple])

        setTimeout(() => {
            setRipples(ripples => ripples.filter(r => r.id !== newRipple.id))
        }, 600)

        onClick?.(e)
    }

    const baseStyles = "neon-button";

    const variants = {
        primary: "",
        secondary: "secondary",
        outline: "outline",
        danger: "danger",
        success: "success",
        ghost: "outline"
    };

    const sizes = {
        sm: "sm",
        md: "md",
        lg: "lg"
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant] || ''} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            onClick={handleClick}
            {...props as any}
        >
            {/* Ripple Effects */}
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="button-ripple"
                    style={{
                        position: 'absolute',
                        left: ripple.x,
                        top: ripple.y,
                        transform: 'translate(-50%, -50%)',
                    }}
                />
            ))}

            {isLoading && (
                <span className="neon-button-spinner">
                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                </span>
            )}

            <span className={`neon-button-content ${isLoading ? 'opacity-0' : 'opacity-100'}`} style={{ opacity: isLoading ? 0 : 1 }}>
                {leftIcon}
                {children}
                {rightIcon}
            </span>
        </motion.button>
    );
});

Button.displayName = 'Button';

export default Button;
