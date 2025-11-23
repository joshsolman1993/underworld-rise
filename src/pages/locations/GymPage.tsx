import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gymApi, TrainingCosts, TrainResult } from '../../api/gym.api'
import { useAuthStore } from '../../store/authStore'
import { useFloatingText } from '../../contexts/FloatingTextContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import ProgressBar from '../../components/ui/ProgressBar'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Zap, DollarSign, Activity, Shield, Zap as ZapIcon, Brain } from 'lucide-react'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { duration: 0.3 }
    }
}

export default function GymPage() {
    const user = useAuthStore((state) => state.user)
    const { showFloatingText } = useFloatingText()
    const [costs, setCosts] = useState<TrainingCosts | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [training, setTraining] = useState<string | null>(null)
    const [result, setResult] = useState<TrainResult | null>(null)
    const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

    useEffect(() => {
        loadCosts()
    }, [])

    const loadCosts = async () => {
        try {
            const data = await gymApi.getTrainingCosts()
            setCosts(data)
        } catch (error) {
            console.error('Failed to load training costs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTrain = async (stat: string) => {
        if (!user) return

        setTraining(stat)
        setResult(null)

        try {
            const trainResult = await gymApi.train(stat)
            setResult(trainResult)

            // Show floating text at button position
            const button = buttonRefs.current[stat]
            if (button) {
                const rect = button.getBoundingClientRect()
                const x = rect.left + rect.width / 2
                const y = rect.top + rect.height / 2

                // Get color based on stat
                const statConfig = stats.find(s => s.key === stat)
                const color = statConfig?.color || 'var(--color-success)'

                showFloatingText(x, y, `+${trainResult.gain}`, color)
            }

            // Reload costs to update current values
            await loadCosts()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Training failed')
        } finally {
            setTraining(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-2xl">
                <div className="spinner" />
            </div>
        )
    }

    const stats = [
        {
            key: 'strength',
            name: 'Strength',
            icon: <Activity size={32} className="text-danger" />,
            description: 'Increases damage in combat',
            variant: 'danger' as const,
            color: 'var(--color-danger)',
        },
        {
            key: 'defense',
            name: 'Defense',
            icon: <Shield size={32} className="text-info" />,
            description: 'Reduces damage taken in combat',
            variant: 'info' as const,
            color: 'var(--color-info)',
        },
        {
            key: 'agility',
            name: 'Agility',
            icon: <ZapIcon size={32} className="text-warning" />,
            description: 'Improves hit chance and dodge',
            variant: 'warning' as const,
            color: 'var(--color-warning)',
        },
        {
            key: 'intelligence',
            name: 'Intelligence',
            icon: <Brain size={32} className="text-accent" />,
            description: 'Increases crime success rate',
            variant: 'default' as const,
            color: 'var(--color-accent-secondary)',
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-col gap-xl"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-panel"
            >
                <h1 className="mb-md">The Gym - Train Your Stats</h1>
                <p className="text-secondary mb-0">
                    Improve your stats to become stronger. Training costs increase as your stats get higher.
                </p>
            </motion.div>

            {/* Result Modal */}
            {result && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-lg"
                >
                    <AnimatedCard variant="success">
                        <Card variant="elevated" className="p-xl bg-green-900/10 border-green-500/30">
                            <h2 className="mb-md text-success">
                                ✅ Training Complete!
                            </h2>

                            <div className="flex-col gap-sm">
                                <p>
                                    📈 {result.stat.charAt(0).toUpperCase() + result.stat.slice(1)}: <strong className="text-success">+{result.gain}</strong> (Now: {result.newValue})
                                </p>
                                <p>⚡ Energy Used: <strong>{result.energySpent}</strong></p>
                                <p>💰 Cost: <strong className="text-warning">${result.moneySpent.toLocaleString()}</strong></p>
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setResult(null)}
                                className="mt-lg"
                            >
                                Continue Training
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            )}

            {/* Training Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid-responsive"
            >
                {stats.map((stat) => {
                    const statCosts = costs?.[stat.key as keyof TrainingCosts]
                    if (!statCosts) return null

                    const canTrain = user && user.energy >= statCosts.energyCost && Number(user.moneyCash) >= statCosts.moneyCost

                    return (
                        <motion.div key={stat.key} variants={itemVariants}>
                            <AnimatedCard variant={stat.variant}>
                                <Card variant="glass" className="p-lg h-full">
                                    <div className="flex items-center gap-md mb-lg">
                                        <div>{stat.icon}</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl mb-xs">{stat.name}</h3>
                                            <p className="text-xs text-muted">
                                                {stat.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-lg">
                                        <div className="flex justify-between text-sm mb-xs">
                                            <span>Current Value</span>
                                            <span className="font-bold" style={{ color: stat.color }}>
                                                {statCosts.currentValue}
                                            </span>
                                        </div>
                                        <ProgressBar
                                            value={statCosts.currentValue}
                                            max={100}
                                            color={stat.variant === 'default' ? 'info' : stat.variant}
                                            showLabel={false}
                                        />
                                    </div>

                                    <div className="flex-col gap-sm mb-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <Zap size={14} /> Energy Cost:
                                            </span>
                                            <span className="text-warning font-mono">{statCosts.energyCost}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <DollarSign size={14} /> Money Cost:
                                            </span>
                                            <span className="text-success font-mono">${statCosts.moneyCost.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Button
                                        ref={(el) => buttonRefs.current[stat.key] = el}
                                        variant="primary"
                                        onClick={() => handleTrain(stat.key)}
                                        disabled={!canTrain || training !== null}
                                        isLoading={training === stat.key}
                                        className="w-full"
                                    >
                                        {canTrain ? 'Train' : user && user.energy < statCosts.energyCost ? 'Not Enough Energy' : 'Not Enough Cash'}
                                    </Button>
                                </Card>
                            </AnimatedCard>
                        </motion.div>
                    )
                })}
            </motion.div>
        </motion.div>
    )
}
