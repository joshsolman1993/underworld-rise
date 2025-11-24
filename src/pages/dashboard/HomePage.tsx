import { motion } from 'framer-motion'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import AnimatedCard from '../../components/ui/AnimatedCard'
import { DollarSign, Skull, Swords, Users, Target, TrendingUp, Clock } from 'lucide-react'

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

export default function HomePage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-col gap-xl"
        >
            {/* Welcome Section */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="glass-panel"
            >
                <h1 className="mb-md">Welcome Back, Boss</h1>
                <p className="text-secondary mb-0">
                    The streets are waiting. What's your next move?
                </p>
            </motion.div>

            {/* Quick Stats Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid-responsive"
            >
                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="warning">
                        <Card variant="elevated" style={{ height: '100%' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <div className="text-muted text-xs mb-xs">
                                        Total Worth
                                    </div>
                                    <div className="text-2xl font-bold text-accent font-mono">
                                        $57,500
                                    </div>
                                </div>
                                <DollarSign size={32} className="text-accent opacity-50" />
                            </div>
                            <div className="text-xs text-success font-mono">
                                +12% from yesterday
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="warning">
                        <Card variant="elevated" style={{ height: '100%' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <div className="text-muted text-xs mb-xs">
                                        Crimes Committed
                                    </div>
                                    <div className="text-2xl font-bold font-mono">
                                        127
                                    </div>
                                </div>
                                <Skull size={32} style={{ color: 'var(--color-accent-orange)', opacity: 0.5 }} />
                            </div>
                            <div className="text-xs text-secondary">
                                Success rate: <span className="font-mono">89%</span>
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="info">
                        <Card variant="elevated" style={{ height: '100%' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <div className="text-muted text-xs mb-xs">
                                        Combat Wins
                                    </div>
                                    <div className="text-2xl font-bold font-mono">
                                        34
                                    </div>
                                </div>
                                <Swords size={32} style={{ color: 'var(--color-accent-tertiary)', opacity: 0.5 }} />
                            </div>
                            <div className="text-xs text-secondary">
                                Win rate: <span className="font-mono">68%</span>
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <AnimatedCard variant="success">
                        <Card variant="elevated" style={{ height: '100%' }}>
                            <div className="flex justify-between items-start mb-md">
                                <div>
                                    <div className="text-muted text-xs mb-xs">
                                        Gang Rank
                                    </div>
                                    <div className="text-2xl font-bold font-mono">
                                        #12
                                    </div>
                                </div>
                                <Users size={32} style={{ color: 'var(--color-accent-teal)', opacity: 0.5 }} />
                            </div>
                            <div className="text-xs text-secondary">
                                The Syndicate
                            </div>
                        </Card>
                    </AnimatedCard>
                </motion.div>
            </motion.div>

            {/* Daily Missions */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
            >
                <h2 className="mb-lg">Daily Missions</h2>
                <div className="flex-col gap-md">
                    <MissionCard
                        title="Commit 5 Crimes"
                        description="Complete any 5 criminal activities"
                        progress={3}
                        total={5}
                        reward="$2,500 + 100 XP"
                        status="in-progress"
                    />
                    <MissionCard
                        title="Win 2 PvP Battles"
                        description="Defeat 2 other players in combat"
                        progress={1}
                        total={2}
                        reward="$5,000 + 200 XP"
                        status="in-progress"
                    />
                    <MissionCard
                        title="Train at the Gym"
                        description="Improve any stat at the gym"
                        progress={0}
                        total={1}
                        reward="$1,000 + 50 XP"
                        status="available"
                    />
                </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
            >
                <h2 className="mb-lg">Recent Activity</h2>
                <Card variant="glass" className="p-lg">
                    <div className="flex-col gap-md">
                        <ActivityItem icon={<DollarSign size={20} />} text="Committed Grand Theft Auto" time="5 minutes ago" success />
                        <ActivityItem icon={<Swords size={20} />} text="Attacked PlayerX and won" time="12 minutes ago" success />
                        <ActivityItem icon={<TrendingUp size={20} />} text="Deposited $10,000 to bank" time="1 hour ago" />
                        <ActivityItem icon={<Target size={20} />} text="Failed to rob a store" time="2 hours ago" success={false} />
                        <ActivityItem icon={<TrendingUp size={20} />} text="Trained Strength at the gym" time="3 hours ago" />
                    </div>
                </Card>
            </motion.div>
        </motion.div>
    )
}

function MissionCard({ title, description, progress, total, reward, status }: {
    title: string
    description: string
    progress: number
    total: number
    reward: string
    status: 'available' | 'in-progress' | 'completed'
}) {
    return (
        <AnimatedCard variant={status === 'completed' ? 'success' : status === 'in-progress' ? 'warning' : 'info'}>
            <Card variant="glass" className="p-lg">
                <div className="flex justify-between items-start mb-md">
                    <div>
                        <h3 className="text-lg mb-xs">{title}</h3>
                        <p className="text-sm text-secondary">{description}</p>
                    </div>
                    <Badge variant={status === 'completed' ? 'success' : status === 'in-progress' ? 'warning' : 'info'}>
                        {status}
                    </Badge>
                </div>
                <div className="mb-sm">
                    <div className="flex justify-between text-xs mb-xs">
                        <span>Progress</span>
                        <span className="font-mono">{progress} / {total}</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full border border-white/10 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${(progress / total) * 100}%`,
                                background: 'linear-gradient(90deg, var(--color-accent-primary), var(--color-accent-secondary))',
                            }}
                        />
                    </div>
                </div>
                <div className="text-sm text-accent">
                    Reward: {reward}
                </div>
            </Card>
        </AnimatedCard>
    )
}

function ActivityItem({ icon, text, time, success }: { icon: React.ReactNode; text: string; time: string; success?: boolean }) {
    return (
        <div className="flex items-center gap-md py-sm">
            <div className={success === false ? 'text-danger' : success ? 'text-success' : 'text-secondary'}>
                {icon}
            </div>
            <div className="flex-1">
                <div className={`text-sm ${success === false ? 'text-danger' : 'text-primary'}`}>
                    {text}
                </div>
                <div className="text-xs text-muted flex items-center gap-xs">
                    <Clock size={12} />
                    {time}
                </div>
            </div>
            {success !== undefined && (
                <Badge variant={success ? 'success' : 'danger'}>
                    {success ? 'Success' : 'Failed'}
                </Badge>
            )}
        </div>
    )
}
