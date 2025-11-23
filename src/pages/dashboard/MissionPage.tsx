import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { missionApi, UserMission } from '../../api/mission.api';
import { useToast } from '../../contexts/ToastContext';
import MissionCard from '../../components/ui/MissionCard';
import Button from '../../components/ui/Button';
import '../../styles/components.css';

export default function MissionPage() {
    const { user, setAuth } = useAuthStore();
    const { toast } = useToast();
    const [missions, setMissions] = useState<UserMission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'ALL' | 'STORY' | 'DAILY'>('ALL');

    useEffect(() => {
        loadMissions();
    }, []);

    const loadMissions = async () => {
        try {
            setIsLoading(true);
            const data = await missionApi.getMyMissions();
            if (Array.isArray(data)) {
                setMissions(data);
            } else {
                console.error('Received invalid missions data:', data);
                setMissions([]);
                toast.error('Received invalid data from server');
            }
        } catch (error) {
            console.error('Failed to load missions:', error);
            toast.error('Failed to load missions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClaim = async (userMissionId: string) => {
        try {
            setClaimingId(userMissionId);
            const response = await missionApi.claimReward(userMissionId);

            if (response.success) {
                toast.success(`Reward claimed! +$${response.rewards.money}, +${response.rewards.xp} XP`);

                // Update local missions state
                setMissions(prev => prev.map(m =>
                    m.id === userMissionId ? { ...m, isClaimed: true } : m
                ));

                // Update user stats in store if needed
                const token = localStorage.getItem('token');
                if (token && user) {
                    setAuth({
                        ...user,
                        xp: response.user.xp,
                        moneyCash: response.user.moneyCash,
                        credits: response.user.credits,
                    }, token);
                }

                // Reload missions to check if new story mission unlocked
                loadMissions();
            }
        } catch (error: any) {
            console.error('Failed to claim reward:', error);
            toast.error(error.response?.data?.message || 'Failed to claim reward');
        } finally {
            setClaimingId(null);
        }
    };

    const filteredMissions = missions.filter(m => {
        if (activeTab === 'ALL') return true;
        return m.mission.type === activeTab;
    });

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '16rem' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '56rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h1 className="text-3xl font-bold font-orbitron text-neon-blue" style={{
                        fontSize: '1.875rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        color: 'var(--color-accent-primary)',
                        textShadow: '0 0 10px rgba(139, 92, 246, 0.5)'
                    }}>
                        Missions
                    </h1>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Complete tasks to earn rewards and reputation.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="glass-panel" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', width: 'fit-content', borderRadius: 'var(--radius-md)' }}>
                <Button
                    variant={activeTab === 'ALL' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('ALL')}
                >
                    All
                </Button>
                <Button
                    variant={activeTab === 'STORY' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('STORY')}
                >
                    Story
                </Button>
                <Button
                    variant={activeTab === 'DAILY' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('DAILY')}
                >
                    Daily
                </Button>
            </div>

            {/* Mission List */}
            <div style={{ display: 'grid', gap: '1rem' }}>
                {filteredMissions.length === 0 ? (
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
                        No missions available in this category.
                    </div>
                ) : (
                    filteredMissions.map((userMission) => (
                        <motion.div
                            key={userMission.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <MissionCard
                                userMission={userMission}
                                onClaim={handleClaim}
                                isClaiming={claimingId === userMission.id}
                            />
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
