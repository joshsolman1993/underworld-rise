import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gangApi, Gang } from '../../api/gang.api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import Input from '../../components/ui/Input'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { Users, Shield, Crown, DollarSign, UserPlus, LogOut, AlertTriangle } from 'lucide-react'

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

export default function GangPage() {
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
            <div className="flex justify-center p-2xl">
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
                <h1 className="mb-md">Gang Management</h1>
                <p className="text-secondary mb-0">
                    Join forces with other players to build a criminal empire. Gangs share a treasury and compete for reputation.
                </p>
            </motion.div>

            {/* My Gang Section */}
            {myGang ? (
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-col gap-lg"
                >
                    <AnimatedCard variant="info">
                        <Card variant="elevated" className="p-2xl">
                            <div className="flex justify-between items-start mb-lg">
                                <div>
                                    <div className="flex items-center gap-md mb-sm">
                                        <h2 className="text-3xl">{myGang.name}</h2>
                                        <Badge variant="info">[{myGang.tag}]</Badge>
                                        {myGang.myRole && <Badge variant={getRoleBadgeVariant(myGang.myRole)}>{myGang.myRole}</Badge>}
                                    </div>
                                    <p className="text-muted flex items-center gap-xs">
                                        <Crown size={16} className="text-warning" /> Leader: {myGang.leader.username}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted">Reputation</div>
                                    <div className="text-2xl font-bold text-accent-gold font-mono">
                                        {myGang.reputation.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
                                <div className="p-md bg-white/5 rounded-md border border-white/10">
                                    <div className="text-xs text-muted mb-xs flex items-center gap-xs">
                                        <DollarSign size={14} /> Treasury
                                    </div>
                                    <div className="text-xl font-bold text-success font-mono">
                                        ${Number(myGang.treasury).toLocaleString()}
                                    </div>
                                </div>
                                <div className="p-md bg-white/5 rounded-md border border-white/10">
                                    <div className="text-xs text-muted mb-xs flex items-center gap-xs">
                                        <Users size={14} /> Members
                                    </div>
                                    <div className="text-xl font-bold">
                                        {myGang.memberCount || 0}
                                    </div>
                                </div>
                            </div>

                            {/* Deposit Form */}
                            <form onSubmit={handleDeposit} className="mb-lg">
                                <label className="block mb-sm text-sm font-semibold">
                                    Contribute to Treasury
                                </label>
                                <div className="flex gap-md">
                                    <Input
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(e.target.value)}
                                        placeholder="Amount"
                                        className="flex-1"
                                    />
                                    <Button variant="primary" type="submit">
                                        Deposit
                                    </Button>
                                </div>
                            </form>

                            {/* Actions */}
                            <div className="flex gap-md">
                                {myGang.myRole === 'leader' && (
                                    <Button variant="outline" onClick={handleDisband} className="text-danger border-danger hover:bg-danger/10">
                                        <AlertTriangle size={16} className="mr-xs" /> Disband Gang
                                    </Button>
                                )}
                                {myGang.myRole !== 'leader' && (
                                    <Button variant="outline" onClick={handleLeave} className="text-warning border-warning hover:bg-warning/10">
                                        <LogOut size={16} className="mr-xs" /> Leave Gang
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </AnimatedCard>

                    {/* Members List */}
                    {myGang.members && myGang.members.length > 0 && (
                        <Card variant="glass" className="p-xl">
                            <h3 className="mb-lg flex items-center gap-sm">
                                <Users className="text-accent" /> Members ({myGang.members.length})
                            </h3>
                            <div className="flex-col gap-md">
                                {myGang.members.map((member) => (
                                    <div
                                        key={member.id}
                                        className="flex justify-between items-center p-md bg-bg-tertiary rounded-md border border-white/5"
                                    >
                                        <div>
                                            <div className="flex items-center gap-md">
                                                <strong>{member.user.username}</strong>
                                                <Badge variant="success">Lvl {member.user.level}</Badge>
                                                <Badge variant={getRoleBadgeVariant(member.role)}>{member.role}</Badge>
                                            </div>
                                            <div className="text-sm text-muted mt-xs">
                                                Contributed: <span className="text-success font-mono">${Number(member.contributedMoney).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </motion.div>
            ) : (
                /* No Gang - Create or Browse */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex-col gap-lg"
                >
                    <Card variant="glass" className="p-2xl text-center">
                        <div className="text-4xl mb-md">👥</div>
                        <h3 className="mb-sm">You're not in a gang</h3>
                        <p className="text-secondary mb-lg">
                            Create your own gang or join an existing one to start building your empire.
                        </p>
                        <Button variant="primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                            {showCreateForm ? 'Cancel' : 'Create Gang ($100,000)'}
                        </Button>

                        {showCreateForm && (
                            <motion.form
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                onSubmit={handleCreateGang}
                                className="mt-xl max-w-md mx-auto"
                            >
                                <div className="mb-md text-left">
                                    <label className="block mb-sm text-sm font-semibold">
                                        Gang Name
                                    </label>
                                    <Input
                                        type="text"
                                        value={gangName}
                                        onChange={(e) => setGangName(e.target.value)}
                                        placeholder="Enter gang name"
                                        required
                                    />
                                </div>
                                <div className="mb-lg text-left">
                                    <label className="block mb-sm text-sm font-semibold">
                                        Gang Tag (max 10 chars)
                                    </label>
                                    <Input
                                        type="text"
                                        value={gangTag}
                                        onChange={(e) => setGangTag(e.target.value.slice(0, 10))}
                                        placeholder="TAG"
                                        required
                                    />
                                </div>
                                <Button variant="primary" type="submit" className="w-full">
                                    <UserPlus size={18} className="mr-xs" /> Create Gang
                                </Button>
                            </motion.form>
                        )}
                    </Card>
                </motion.div>
            )}

            {/* All Gangs List */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h2 className="mb-lg flex items-center gap-sm">
                    <Shield className="text-info" /> All Gangs ({allGangs.length})
                </h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid-responsive"
                >
                    {allGangs.map((gang) => (
                        <motion.div key={gang.id} variants={itemVariants}>
                            <AnimatedCard variant="default">
                                <Card variant="glass" className="p-lg h-full">
                                    <div className="flex justify-between items-start mb-md">
                                        <div>
                                            <div className="flex items-center gap-sm mb-xs">
                                                <h3 className="text-lg">{gang.name}</h3>
                                                <Badge variant="info">[{gang.tag}]</Badge>
                                            </div>
                                            <p className="text-sm text-muted flex items-center gap-xs">
                                                <Crown size={12} /> Leader: {gang.leader.username}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-col gap-sm">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Members:</span>
                                            <span>{gang.memberCount || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted">Reputation:</span>
                                            <span className="text-accent-gold font-bold">
                                                {gang.reputation.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
