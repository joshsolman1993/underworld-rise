import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { combatApi, OnlinePlayer, CombatResult } from '../../api/combat.api'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Swords, Zap, Activity, Heart } from 'lucide-react'

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

export default function CombatPage() {
    const user = useAuthStore((state) => state.user)
    const [players, setPlayers] = useState<OnlinePlayer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [attacking, setAttacking] = useState<string | null>(null)
    const [result, setResult] = useState<CombatResult | null>(null)

    useEffect(() => {
        loadPlayers()
    }, [])

    const loadPlayers = async () => {
        try {
            const data = await combatApi.getOnlinePlayers()
            setPlayers(data)
        } catch (error) {
            console.error('Failed to load players:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAttack = async (defenderId: string) => {
        if (!user) return

        setAttacking(defenderId)
        setResult(null)

        try {
            const attackResult = await combatApi.attack(defenderId)
            setResult(attackResult)
            // Reload players after attack
            await loadPlayers()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Attack failed')
        } finally {
            setAttacking(null)
        }
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-2xl">
                <div className="spinner" />
            </div>
        )
    }

    const getResultColor = (result: string) => {
        switch (result) {
            case 'attacker_win': return 'var(--color-success)'
            case 'defender_win': return 'var(--color-danger)'
            case 'draw': return 'var(--color-warning)'
            default: return 'var(--color-text-primary)'
        }
    }

    const getResultText = (result: string) => {
        switch (result) {
            case 'attacker_win': return '🎉 Victory!'
            case 'defender_win': return '💀 Defeat!'
            case 'draw': return '🤝 Draw!'
            default: return 'Unknown'
        }
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
                <h1 className="mb-md">PvP Combat Arena</h1>
                <p className="text-secondary mb-0">
                    Attack other players to steal their money and gain XP. Be careful - losing sends you to the hospital!
                </p>
            </motion.div>

            {/* Combat Result Modal */}
            {result && (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-lg"
                >
                    <AnimatedCard variant={result.result === 'attacker_win' ? 'success' : result.result === 'defender_win' ? 'danger' : 'warning'}>
                        <Card variant="elevated" className={`p-xl ${result.result === 'attacker_win' ? 'bg-green-900/10 border-green-500/30' : result.result === 'defender_win' ? 'bg-red-900/10 border-red-500/30' : 'bg-yellow-900/10 border-yellow-500/30'}`}>
                            <h2 className="mb-md" style={{ color: getResultColor(result.result) }}>
                                {getResultText(result.result)}
                            </h2>

                            <div className="flex-col gap-sm">
                                <p>🎯 Opponent: <strong>{result.defenderName}</strong></p>
                                <p>⚔️ Your Damage: <strong className="text-danger">{result.attackerDamage.toFixed(1)}</strong></p>
                                <p>🛡️ Their Damage: <strong className="text-info">{result.defenderDamage.toFixed(1)}</strong></p>

                                {result.result === 'attacker_win' && (
                                    <>
                                        <p>💰 Money Stolen: <strong className="text-success">${result.moneyStolen.toLocaleString()}</strong></p>
                                        <p>⭐ XP Gained: <strong className="text-warning">+{result.xpGained}</strong></p>
                                    </>
                                )}

                                {result.result === 'defender_win' && (
                                    <p className="text-danger">💊 You've been sent to the hospital for 30-60 minutes!</p>
                                )}
                            </div>

                            <Button
                                variant="outline"
                                onClick={() => setResult(null)}
                                className="mt-lg"
                            >
                                Continue
                            </Button>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            )}

            {/* Player Stats */}
            {user && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card variant="glass" className="p-xl">
                        <h3 className="mb-md flex items-center gap-sm">
                            <Activity className="text-accent" /> Your Combat Stats
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div>
                                <div className="text-xs text-muted mb-xs flex items-center gap-xs">
                                    <Zap size={14} /> Nerve
                                </div>
                                <ProgressBar value={user.nerve} max={100} color="primary" />
                            </div>
                            <div>
                                <div className="text-xs text-muted mb-xs flex items-center gap-xs">
                                    <Heart size={14} /> Health
                                </div>
                                <ProgressBar value={user.health} max={100} color="danger" />
                            </div>
                        </div>
                        <p className="mt-md text-sm text-muted">
                            💡 Each attack costs 10 nerve. Equip better items to increase your combat power!
                        </p>
                    </Card>
                </motion.div>
            )}

            {/* Online Players List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="mb-lg flex items-center gap-sm">
                    <Swords className="text-danger" /> Online Players ({players.length})
                </h2>

                {players.length === 0 ? (
                    <Card variant="glass" className="p-2xl text-center">
                        <div className="text-4xl mb-md">👥</div>
                        <h3 className="mb-sm">No players available</h3>
                        <p className="text-secondary">
                            All players are currently in prison or hospital. Check back later!
                        </p>
                    </Card>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid-responsive"
                    >
                        {players.map((player) => {
                            const canAttack = user && user.nerve >= 10
                            const totalPower = player.stats.strength + player.stats.defense + player.stats.agility

                            return (
                                <motion.div key={player.id} variants={itemVariants}>
                                    <AnimatedCard variant="danger">
                                        <Card variant="glass" className="p-lg h-full">
                                            <div className="flex justify-between items-start mb-md">
                                                <div>
                                                    <h3 className="text-xl mb-xs">{player.username}</h3>
                                                    <Badge variant="success">Level {player.level}</Badge>
                                                </div>
                                                <div className="text-2xl">⚔️</div>
                                            </div>

                                            <div className="mb-lg">
                                                <div className="text-xs text-muted mb-xs">
                                                    Health
                                                </div>
                                                <ProgressBar value={player.health} max={100} color="danger" showLabel />
                                            </div>

                                            <div className="flex-col gap-xs mb-lg">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted">💪 Strength:</span>
                                                    <span>{player.stats.strength}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted">🛡️ Defense:</span>
                                                    <span>{player.stats.defense}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-muted">⚡ Agility:</span>
                                                    <span>{player.stats.agility}</span>
                                                </div>
                                                <div className="flex justify-between text-sm pt-xs border-t border-white/10 mt-xs">
                                                    <span className="text-muted">Total Power:</span>
                                                    <span className="font-bold text-accent">{totalPower}</span>
                                                </div>
                                            </div>

                                            <Button
                                                variant="primary"
                                                onClick={() => handleAttack(player.id)}
                                                disabled={!canAttack || attacking !== null}
                                                isLoading={attacking === player.id}
                                                className="w-full"
                                            >
                                                {canAttack ? 'Attack' : 'Not Enough Nerve'}
                                            </Button>
                                        </Card>
                                    </AnimatedCard>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    )
}
