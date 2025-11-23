import React from 'react';
import { motion } from 'framer-motion';
import '../../styles/components.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
}) => {
    const baseStyles = "neon-button";

    const variants = {
        primary: "",
        secondary: "secondary",
        outline: "outline",
        danger: "danger",
        success: "success",
        ghost: "outline" // Fallback to outline for ghost, or add specific ghost style if needed
    };

    const sizes = {
        sm: "sm",
        md: "md",
        lg: "lg"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant] || ''} ${sizes[size]} ${className}`}
            disabled={isLoading || disabled}
            {...props as any}
        >
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
};

export default Button;
