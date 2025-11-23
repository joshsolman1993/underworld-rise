import { useState, useEffect } from 'react'
import { gangApi, Gang } from '../../api/gang.api'
import { useAuthStore } from '../../store/authStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'

export default function GangPage() {
    const user = useAuthStore((state) => state.user)
    const [myGang, setMyGang] = useState<Gang | null>(null)
    const [allGangs, setAllGangs] = useState<Gang[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [gangName, setGangName] = useState('')
    const [gangTag, setGangTag] = useState('')
    const [depositAmount, setDepositAmount] = useState('')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [gang, gangs] = await Promise.all([
                gangApi.getMyGang(),
                gangApi.getAllGangs(),
            ])
            setMyGang(gang)
            setAllGangs(gangs)
        } catch (error) {
            console.error('Failed to load gang data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateGang = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await gangApi.createGang(gangName, gangTag)
            await loadData()
            setShowCreateForm(false)
            setGangName('')
            setGangTag('')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create gang')
        }
    }

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!myGang) return

        const amount = parseInt(depositAmount)
        if (isNaN(amount) || amount <= 0) {
            alert('Invalid amount')
            return
        }

        try {
            await gangApi.depositToTreasury(myGang.id, amount)
            await loadData()
            setDepositAmount('')
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to deposit')
        }
    }

    const handleLeave = async () => {
        if (!confirm('Are you sure you want to leave the gang?')) return

        try {
            await gangApi.leaveGang()
            await loadData()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to leave gang')
        }
    }

    const handleDisband = async () => {
        if (!myGang) return
        if (!confirm('Are you sure you want to disband the gang? This cannot be undone!')) return

        try {
            await gangApi.disbandGang(myGang.id)
            await loadData()
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to disband gang')
        }
    }

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
                <div className="spinner" />
            </div>
        )
    }

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case 'leader': return 'danger'
            case 'officer': return 'warning'
            default: return 'success'
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Header */}
            <div>
                <h1 style={{ marginBottom: 'var(--space-md)' }}>Gang Management</h1>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                    Join forces with other players to build a criminal empire. Gangs share a treasury and compete for reputation.
                </p>
            </div>

            {/* My Gang Section */}
            {myGang ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <Card variant="elevated" style={{ padding: 'var(--space-2xl)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-lg)' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
                                    <h2 style={{ fontSize: 'var(--font-size-3xl)' }}>{myGang.name}</h2>
                                    <Badge variant="primary">[{myGang.tag}]</Badge>
                                    {myGang.myRole && <Badge variant={getRoleBadgeVariant(myGang.myRole)}>{myGang.myRole}</Badge>}
                                </div>
                                <p style={{ color: 'var(--color-text-muted)' }}>Leader: {myGang.leader.username}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>Reputation</div>
                                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-gold)' }}>
                                    {myGang.reputation.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                    Treasury
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                                    ${Number(myGang.treasury).toLocaleString()}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xs)' }}>
                                    Members
                                </div>
                                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                                    {myGang.memberCount || 0}
                                </div>
                            </div>
                        </div>

                        {/* Deposit Form */}
                        <form onSubmit={handleDeposit} style={{ marginBottom: 'var(--space-lg)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                Contribute to Treasury
                            </label>
                            <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    placeholder="Amount"
                                    className="input-field"
                                    style={{ flex: 1 }}
                                />
                                <Button variant="primary" type="submit">
                                    Deposit
                                </Button>
                            </div>
                        </form>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                            {myGang.myRole === 'leader' && (
                                <Button variant="outline" onClick={handleDisband}>
                                    Disband Gang
                                </Button>
                            )}
                            {myGang.myRole !== 'leader' && (
                                <Button variant="outline" onClick={handleLeave}>
                                    Leave Gang
                                </Button>
                            )}
                        </div>
                    </Card>

                    {/* Members List */}
                    {myGang.members && myGang.members.length > 0 && (
                        <Card variant="glass" style={{ padding: 'var(--space-xl)' }}>
                            <h3 style={{ marginBottom: 'var(--space-lg)' }}>Members ({myGang.members.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                                {myGang.members.map((member) => (
                                    <div
                                        key={member.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: 'var(--space-md)',
                                            background: 'var(--color-bg-tertiary)',
                                            borderRadius: 'var(--radius-md)',
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                                                <strong>{member.user.username}</strong>
                                                <Badge variant="success">Lvl {member.user.level}</Badge>
                                                <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
                                                Contributed: ${Number(member.contributedMoney).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            ) : (
                /* No Gang - Create or Browse */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <Card variant="glass" style={{ padding: 'var(--space-2xl)', textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-4xl)', marginBottom: 'var(--space-md)' }}>👥</div>
                        <h3 style={{ marginBottom: 'var(--space-sm)' }}>You're not in a gang</h3>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
                            Create your own gang or join an existing one to start building your empire.
                        </p>
                        <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                            {showCreateForm ? 'Cancel' : 'Create Gang ($100,000)'}
                        </Button>

                        {showCreateForm && (
                            <form onSubmit={handleCreateGang} style={{ marginTop: 'var(--space-xl)', maxWidth: '400px', margin: '0 auto' }}>
                                <div style={{ marginBottom: 'var(--space-md)' }}>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                        Gang Name
                                    </label>
                                    <input
                                        type="text"
                                        value={gangName}
                                        onChange={(e) => setGangName(e.target.value)}
                                        placeholder="Enter gang name"
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <div style={{ marginBottom: 'var(--space-lg)' }}>
                                    <label style={{ display: 'block', marginBottom: 'var(--space-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                        Gang Tag (max 10 chars)
                                    </label>
                                    <input
                                        type="text"
                                        value={gangTag}
                                        onChange={(e) => setGangTag(e.target.value.slice(0, 10))}
                                        placeholder="TAG"
                                        className="input-field"
                                        required
                                    />
                                </div>
                                <Button variant="primary" type="submit" style={{ width: '100%' }}>
                                    Create Gang
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            )}

            {/* All Gangs List */}
            <div>
                <h2 style={{ marginBottom: 'var(--space-lg)' }}>All Gangs ({allGangs.length})</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
                    {allGangs.map((gang) => (
                        <Card key={gang.id} variant="glass" style={{ padding: 'var(--space-lg)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-md)' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xs)' }}>
                                        <h3 style={{ fontSize: 'var(--font-size-lg)' }}>{gang.name}</h3>
                                        <Badge variant="primary">[{gang.tag}]</Badge>
                                    </div>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                                        Leader: {gang.leader.username}
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Members:</span>
                                    <span>{gang.memberCount || 0}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                                    <span style={{ color: 'var(--color-text-muted)' }}>Reputation:</span>
                                    <span style={{ color: 'var(--color-accent-gold)', fontWeight: 'var(--font-weight-bold)' }}>
                                        {gang.reputation.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
