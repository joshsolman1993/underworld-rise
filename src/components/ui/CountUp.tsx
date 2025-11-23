import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useSpring, useTransform, MotionValue } from 'framer-motion'

interface CountUpProps {
    value: number
    duration?: number
    format?: (value: number) => string
}

export default function CountUp({ value, duration = 0.5, format }: CountUpProps) {
    const spring = useSpring(value, { duration: duration * 1000, bounce: 0 })
    const display = useTransform(spring, (current) =>
        format ? format(Math.round(current)) : Math.round(current).toLocaleString()
    )

    useEffect(() => {
        spring.set(value)
    }, [spring, value])

    return <motion.span>{display}</motion.span>
}
