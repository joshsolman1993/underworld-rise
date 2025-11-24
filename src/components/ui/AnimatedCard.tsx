import React, { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import '../../styles/components.css';

interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    onClick?: () => void;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    className = '',
    delay = 0,
    variant = 'default',
    onClick
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isPressed, setIsPressed] = useState(false);

    // Mouse position for shine effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth mouse position for tilt effect
    const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPos = clientX - left;
        const yPos = clientY - top;

        x.set(xPos);
        y.set(yPos);

        // Calculate tilt (normalize to -1 to 1)
        const xPct = (xPos / width - 0.5) * 2;
        const yPct = (yPos / height - 0.5) * 2;

        mouseX.set(xPct);
        mouseY.set(yPct);
    }

    function onMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
        x.set(0);
        y.set(0);
        setIsPressed(false);
    }

    const getGlowColor = () => {
        switch (variant) {
            case 'success': return 'rgba(16, 185, 129, 0.15)';
            case 'warning': return 'rgba(245, 158, 11, 0.15)';
            case 'danger': return 'rgba(239, 68, 68, 0.15)';
            case 'info': return 'rgba(59, 130, 246, 0.15)';
            default: return 'rgba(139, 92, 246, 0.15)';
        }
    };

    const getBorderGradient = () => {
        switch (variant) {
            case 'success': return 'linear-gradient(90deg, #10b981, #34d399)';
            case 'warning': return 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            case 'danger': return 'linear-gradient(90deg, #ef4444, #f87171)';
            case 'info': return 'linear-gradient(90deg, #3b82f6, #60a5fa)';
            default: return 'linear-gradient(90deg, #8b5cf6, #d946ef)';
        }
    };

    const maskImage = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, white, transparent)`;
    const style = { maskImage, WebkitMaskImage: maskImage };

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay, ease: [0.2, 0.8, 0.2, 1] }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onClick={onClick}
            whileTap={onClick ? { scale: 0.98 } : {}}
            className={`animated-card ${className}`}
            style={{
                transformStyle: "preserve-3d",
                transform: isPressed && onClick ? 'scale(0.98)' : undefined,
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.1s ease',
            }}
        >
            {/* Shine Effect */}
            <motion.div
                className="animated-card-shine"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${x}px ${y}px,
              ${getGlowColor()},
              transparent 80%
            )
          `
                }}
            />

            {/* Border Glow */}
            <motion.div
                className="animated-card-border"
                style={style}
            >
                <div style={{ position: 'absolute', inset: 0, background: getBorderGradient(), opacity: 0.2 }} />
            </motion.div>

            {/* Content */}
            <div className="animated-card-content">
                {children}
            </div>
        </motion.div>
    );
};

export default AnimatedCard;
