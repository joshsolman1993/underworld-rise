import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { crimeApi, Crime } from '../../api/crime.api'
import { useAuthStore } from '../../store/authStore'
import { useToast } from '../../contexts/ToastContext'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Zap, DollarSign, Star, AlertTriangle } from 'lucide-react'

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

export default function SlumPage() {
    const user = useAuthStore((state) => state.user)
    const { toast } = useToast()
    const [crimes, setCrimes] = useState<Crime[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [committingCrime, setCommittingCrime] = useState<number | null>(null)

    useEffect(() => {
        loadCrimes()
    }, [])

    const loadCrimes = async () => {
        try {
            const data = await crimeApi.getAllCrimes()
            setCrimes(data)
        } catch (error) {
            console.error('Failed to load crimes:', error)
            toast.error('Failed to load crimes')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCommitCrime = async (crime: Crime) => {
        if (!user || user.energy < crime.energyCost) return

        setCommittingCrime(crime.id)

        try {
            const result = await crimeApi.commitCrime(crime.id)

            if (result.success) {
                let message = `Earned $${result.moneyEarned?.toLocaleString()}! +${result.xpEarned} XP`
                if (result.levelUp) {
                    message += ` 🎉 LEVEL UP to ${result.newLevel}!`
                }
                toast.success(message, 5000)
            } else {
                if (result.jailed) {
                    toast.error(`🚔 Caught! Jailed for ${result.jailTime} minutes`, 5000)
                } else {
                    toast.error('Crime failed but you escaped')
                }
            }

            // Refresh user data would go here
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to commit crime')
        } finally {
            setCommittingCrime(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-2xl">
                <div className="spinner" />
            </div>
        )
    }

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
                <h1 className="mb-md">The Slum - Criminal Activities</h1>
                <p className="text-secondary mb-0">
                    Commit crimes to earn money and experience. Higher difficulty crimes require more intelligence and energy.
                </p>
            </motion.div>

            {/* Crimes Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid-responsive"
            >
                {crimes.map((crime) => {
                    const canCommit = user && user.level >= crime.requiredLevel && user.energy >= crime.energyCost
                    const successChance = user ? Math.min(((user.stats?.intelligence || 10) * 1.5 / crime.difficulty) * 100, 95) : 0

                    return (
                        <motion.div key={crime.id} variants={itemVariants}>
                            <AnimatedCard variant="danger">
                                <Card variant="glass" className="p-lg h-full">
                                    <div className="flex justify-between items-start mb-md">
                                        <h3 className="text-xl">{crime.name}</h3>
                                        <Badge variant={canCommit ? 'success' : 'danger'}>
                                            Lvl {crime.requiredLevel}
                                        </Badge>
                                    </div>

                                    <p className="text-secondary text-sm mb-lg">
                                        {crime.description}
                                    </p>

                                    <div className="flex-col gap-sm mb-lg">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <Zap size={14} /> Energy Cost:
                                            </span>
                                            <span className="text-warning font-mono">{crime.energyCost}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <DollarSign size={14} /> Reward:
                                            </span>
                                            <span className="text-success font-mono">${crime.minMoney} - ${crime.maxMoney}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <Star size={14} /> XP:
                                            </span>
                                            <span className="text-info font-mono">+{crime.xpReward}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted flex items-center gap-xs">
                                                <AlertTriangle size={14} /> Jail Risk:
                                            </span>
                                            <span className="text-danger font-mono">{(crime.jailChance * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>

                                    <div className="mb-md">
                                        <div className="flex justify-between text-xs mb-xs">
                                            <span>Success Chance</span>
                                            <span className="font-mono">{Math.round(successChance)}%</span>
                                        </div>
                                        <ProgressBar
                                            value={successChance}
                                            max={100}
                                            color={successChance > 70 ? 'success' : successChance > 40 ? 'warning' : 'danger'}
                                            showLabel={false}
                                        />
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => handleCommitCrime(crime)}
                                        disabled={!canCommit || committingCrime !== null}
                                        isLoading={committingCrime === crime.id}
                                        className="w-full"
                                    >
                                        {canCommit ? 'Commit Crime' : user && user.level < crime.requiredLevel ? 'Level Too Low' : 'Not Enough Energy'}
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
