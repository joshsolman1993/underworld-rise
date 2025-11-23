import { useState, useEffect } from 'react'
import { combatApi, OnlinePlayer, CombatResult } from '../../api/combat.api'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'

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
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Header */}
            <div>
                <h1 style={{ marginBottom: 'var(--space-md)' }}>PvP Combat Arena</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Attack other players to steal their money and gain XP. Be careful - losing sends you to the hospital!
                </p>
            </div>

            {/* Combat Result Modal */}
            {result && (
                <Card variant="elevated" style={{ padding: 'var(--space-xl)', background: `rgba(${result.result === 'attacker_win' ? '0, 255, 136' : result.result === 'defender_win' ? '255, 51, 102' : '255, 170, 0'}, 0.1)` }}>
                    <h2 style={{ marginBottom: 'var(--space-md)', color: getResultColor(result.result) }}>
                        {getResultText(result.result)}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        <p>🎯 Opponent: <strong>{result.defenderName}</strong></p>
                        <p>⚔️ Your Damage: <strong style={{ color: 'var(--color-danger)' }}>{result.attackerDamage.toFixed(1)}</strong></p>
                        <p>🛡️ Their Damage: <strong style={{ color: 'var(--color-info)' }}>{result.defenderDamage.toFixed(1)}</strong></p>

                        {result.result === 'attacker_win' && (
                            <>
                                <p>💰 Money Stolen: <strong style={{ color: 'var(--color-success)' }}>${result.moneyStolen.toLocaleString()}</strong></p>
                                <p>⭐ XP Gained: <strong style={{ color: 'var(--color-warning)' }}>+{result.xpGained}</strong></p>
                            </>
                        )}

                        {result.result === 'defender_win' && (
                            <p style={{ color: 'var(--color-danger)' }}>💊 You've been sent to the hospital for 30-60 minutes!</p>
                        )}
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setResult(null)}
                        style={{ marginTop: 'var(--space-lg)' }}
                    >
                        Continue
                    </Button>
                </Card>
            )}

            {/* Player Stats */}
            {user && (
                <Card variant="glass" style={{ padding: 'var(--space-xl)' }}>
                    <h3 style={{ marginBottom: 'var(--space-md)' }}>Your Combat Stats</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-lg)' }}>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>Nerve</div>
                            <ProgressBar value={user.nerve} max={100} color="primary" />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>Health</div>
                            <ProgressBar value={user.health} max={100} color="danger" />
                        </div>
                    </div>
                    <p style={{ marginTop: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                        💡 Each attack costs 10 nerve. Equip better items to increase your combat power!
                    </p>
                </Card>
            )}

            {/* Online Players List */}
            <div>
                <h2 style={{ marginBottom: 'var(--space-lg)' }}>Online Players ({players.length})</h2>

                {players.length === 0 ? (
                    <Card variant="glass" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-md)' }}>👥</div>
                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>No players available</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            All players are currently in prison or hospital. Check back later!
                        </p>
                    </Card>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                        {players.map((player) => {
                            const canAttack = user && user.nerve >= 10
                            const totalPower = player.stats.strength + player.stats.defense + player.stats.agility

                            return (
                                <Card key={player.id} variant="glass" style={{ padding: 'var(--space-lg)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                                        <div>
                                            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--space-xs)' }}>{player.username}</h3>
                                            <Badge variant="success">Level {player.level}</Badge>
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-2xl)' }}>⚔️</div>
                                    </div>

                                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                            Health
                                        </div>
                                        <ProgressBar value={player.health} max={100} color="danger" showLabel />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', marginBottom: 'var(--space-lg)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>💪 Strength:</span>
                                            <span>{player.stats.strength}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>🛡️ Defense:</span>
                                            <span>{player.stats.defense}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>⚡ Agility:</span>
                                            <span>{player.stats.agility}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', paddingTop: 'var(--space-xs)', borderTop: '1px solid var(--color-border)' }}>
                                            <span style={{ color: 'var(--color-text-muted)' }}>Total Power:</span>
                                            <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-gold)' }}>{totalPower}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => handleAttack(player.id)}
                                        disabled={!canAttack || attacking !== null}
                                        isLoading={attacking === player.id}
                                        style={{ width: '100%' }}
                                    >
                                        {canAttack ? 'Attack' : 'Not Enough Nerve'}
                                    </Button>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
